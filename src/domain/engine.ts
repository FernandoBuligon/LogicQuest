import { evaluateGate, inputHandles } from './gates'
import type { Circuit, CircuitIssue, CircuitNode, Evaluation, InputHandle, InputValues, Signal, Wire } from './types'

export function targetHandles(node: CircuitNode): InputHandle[] {
  return node.kind === 'gate' ? inputHandles(node.gate) : node.kind === 'output' ? ['in1'] : []
}

function nodeName(node: CircuitNode): string {
  return node.kind === 'input' ? `Entrada ${node.label}` : node.kind === 'output' ? 'Saída' : `Porta ${node.gate} (${node.id})`
}

// Verificação estrutural também serve ao editor enquanto o circuito está incompleto.
export function inspectCircuit(circuit: Circuit, requireComplete = true): CircuitIssue[] {
  const issues: CircuitIssue[] = []
  const nodes = new Map<string, CircuitNode>()
  for (const node of circuit.nodes) {
    if (nodes.has(node.id)) issues.push({ code: 'duplicate', message: 'Há componentes com o mesmo identificador.' })
    nodes.set(node.id, node)
  }
  if (circuit.nodes.filter(node => node.kind === 'output').length !== 1) {
    issues.push({ code: 'output-count', message: 'O circuito precisa de exatamente uma saída.' })
  }
  const occupied = new Map<string, Set<string>>()
  const wireIds = new Set<string>()
  const outgoing = new Map<string, string[]>()
  for (const wire of circuit.wires) {
    if (wireIds.has(wire.id)) issues.push({ code: 'duplicate', message: 'Há fios com o mesmo identificador.' })
    wireIds.add(wire.id)
    const source = nodes.get(wire.source)
    const target = nodes.get(wire.target)
    if (!source || !target) {
      issues.push({ code: 'missing-node', message: 'Um fio aponta para um componente inexistente.' })
      continue
    }
    if (source.kind === 'output' || wire.sourceHandle !== 'out' || !targetHandles(target).includes(wire.targetHandle)) {
      issues.push({ code: 'invalid-connection', message: 'Ligue uma saída à entrada de uma porta ou à saída do circuito.' })
      continue
    }
    const handles = occupied.get(target.id) ?? new Set<string>()
    if (handles.has(wire.targetHandle)) {
      issues.push({ code: 'occupied', message: `${nodeName(target)}: a entrada já tem um fio. Remova-o antes de conectar outro.`, nodeId: target.id })
    }
    handles.add(wire.targetHandle)
    occupied.set(target.id, handles)
    outgoing.set(source.id, [...(outgoing.get(source.id) ?? []), target.id])
  }
  // Kahn visita todos os componentes, inclusive ciclos fora do caminho da saída.
  const indegree = new Map([...nodes.keys()].map(id => [id, 0]))
  for (const targets of outgoing.values()) {
    for (const id of targets) indegree.set(id, indegree.get(id)! + 1)
  }
  const queue = [...nodes.keys()].filter(id => indegree.get(id) === 0)
  let visited = 0
  for (let i = 0; i < queue.length; i++) {
    visited++
    for (const id of outgoing.get(queue[i]) ?? []) {
      indegree.set(id, indegree.get(id)! - 1)
      if (indegree.get(id) === 0) queue.push(id)
    }
  }
  if (visited !== nodes.size) issues.push({ code: 'cycle', message: 'Esse fio cria um ciclo. O sinal deve seguir até a saída sem voltar a uma porta anterior.' })
  if (requireComplete) {
    for (const node of circuit.nodes) {
      for (const handle of targetHandles(node)) {
        if (!occupied.get(node.id)?.has(handle)) issues.push({
          code: 'incomplete', nodeId: node.id,
          message: `${nodeName(node)}: conecte a entrada ${handle === 'in1' ? '1' : '2'}.`,
        })
      }
    }
  }
  return issues
}

export function connectionIssue(circuit: Circuit, wire: Wire): CircuitIssue | undefined {
  return inspectCircuit({ ...circuit, wires: [...circuit.wires, wire] }, false)[0]
}

export function evaluateCircuit(circuit: Circuit, inputs: InputValues): Evaluation {
  const issues = inspectCircuit(circuit)
  const nodeSignals: Record<string, Signal> = Object.fromEntries(circuit.nodes.map(node => [node.id, null]))
  const wireSignals: Record<string, Signal> = Object.fromEntries(circuit.wires.map(wire => [wire.id, null]))
  if (issues.some(issue => issue.code !== 'incomplete')) {
    return { ok: false, output: null, nodeSignals, wireSignals, issues }
  }
  const incoming = new Map<string, Map<InputHandle, string>>()
  for (const wire of circuit.wires) {
    const handles = incoming.get(wire.target) ?? new Map<InputHandle, string>()
    handles.set(wire.targetHandle, wire.source)
    incoming.set(wire.target, handles)
  }
  const pending = new Map(circuit.nodes.map(node => [node.id, node]))
  while (pending.size) {
    for (const [id, node] of pending) {
      const dependencies = [...(incoming.get(id)?.values() ?? [])]
      if (dependencies.some(source => pending.has(source))) continue
      if (node.kind === 'input') {
        if (typeof inputs[id] !== 'boolean') issues.push({ code: 'missing-value', nodeId: id, message: `${nodeName(node)}: escolha 0 ou 1.` })
        else nodeSignals[id] = inputs[id]
      } else {
        const values = targetHandles(node).map(handle => {
          const source = incoming.get(id)?.get(handle)
          return source === undefined ? null : nodeSignals[source]
        })
        if (values.every(value => value !== null)) {
          nodeSignals[id] = node.kind === 'output' ? values[0] : evaluateGate(node.gate, values[0]!, values[1] ?? false)
        }
      }
      pending.delete(id)
    }
  }
  for (const wire of circuit.wires) wireSignals[wire.id] = nodeSignals[wire.source]
  const output = circuit.nodes.find(node => node.kind === 'output')!
  return { ok: issues.length === 0, output: nodeSignals[output.id], nodeSignals, wireSignals, issues }
}
