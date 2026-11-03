import { describe, expect, it } from 'vitest'
import { and, or, not, xor } from './gates'
import { connectionIssue, evaluateCircuit, inspectCircuit } from './engine'
import type { Circuit, GateKind, Wire } from './types'

const wire = (source: string, target: string, targetHandle: Wire['targetHandle'] = 'in1'): Wire => ({
  id: `${source}-${target}-${targetHandle}`, source, target, targetHandle, sourceHandle: 'out',
})
function simple(gate: GateKind): Circuit {
  return {
    nodes: [{ id: 'A', kind: 'input', label: 'A' }, { id: 'B', kind: 'input', label: 'B' }, { id: 'g', kind: 'gate', gate }, { id: 'out', kind: 'output' }],
    wires: [wire('A', 'g'), ...(gate === 'NOT' ? [] : [wire('B', 'g', 'in2')]), wire('g', 'out')],
  }
}

describe('tabelas-verdade', () => {
  it.each([
    [false, false, false, false, false], [false, true, false, true, true],
    [true, false, false, true, true], [true, true, true, true, false],
  ])('AND, OR e XOR para %s/%s', (a, b, expectedAnd, expectedOr, expectedXor) => {
    expect(and(a, b)).toBe(expectedAnd)
    expect(or(a, b)).toBe(expectedOr)
    expect(xor(a, b)).toBe(expectedXor)
    for (const [gate, expected] of [['AND', expectedAnd], ['OR', expectedOr], ['XOR', expectedXor]] as const) {
      const result = evaluateCircuit(simple(gate), { A: a, B: b })
      expect(result.ok).toBe(true)
      expect(result.output).toBe(expected)
      expect(result.wireSignals['g-out-in1']).toBe(expected)
    }
  })
  it.each([false, true])('NOT para %s', a => {
    expect(not(a)).toBe(!a)
    expect(evaluateCircuit(simple('NOT'), { A: a, B: false }).output).toBe(!a)
  })
})

describe('motor de grafos', () => {
  it('compõe portas, permite ramificação e independe da ordem dos nós', () => {
    const circuit = simple('AND')
    circuit.nodes.push({ id: 'n', kind: 'gate', gate: 'NOT' })
    circuit.wires = [wire('A', 'n'), wire('n', 'g'), wire('A', 'g', 'in2'), wire('g', 'out')]
    circuit.nodes.reverse()
    for (const A of [false, true]) expect(evaluateCircuit(circuit, { A, B: false }).output).toBe(false)
  })
  it('mantém os sinais conhecidos em um circuito incompleto', () => {
    const circuit = simple('AND')
    circuit.wires = circuit.wires.filter(w => w.source !== 'B')
    const result = evaluateCircuit(circuit, { A: true, B: false })
    expect(result.ok).toBe(false)
    expect(result.issues[0].code).toBe('incomplete')
    expect(result.nodeSignals.A).toBe(true)
    expect(result.wireSignals['A-g-in1']).toBe(true)
    expect(result.output).toBeNull()
  })
  it('exige um valor booleano para cada entrada', () => {
    expect(evaluateCircuit(simple('AND'), { A: false }).issues.map(i => i.code)).toContain('missing-value')
  })
  it('detecta destino ocupado antes de inserir', () => {
    expect(connectionIssue(simple('AND'), wire('B', 'g'))?.code).toBe('occupied')
  })
  it.each([
    ['origem inexistente', wire('missing', 'g'), 'missing-node'],
    ['destino inexistente', wire('A', 'missing'), 'missing-node'],
    ['entrada como destino', wire('B', 'A'), 'invalid-connection'],
    ['saída como origem', wire('out', 'g'), 'invalid-connection'],
    ['handle inexistente', { ...wire('A', 'g'), targetHandle: 'bad' }, 'invalid-connection'],
    ['handle de origem inválido', { ...wire('A', 'g'), sourceHandle: 'bad' }, 'invalid-connection'],
  ])('rejeita %s', (_name, invalidWire, code) => {
    const result = evaluateCircuit({ ...simple('AND'), wires: [invalidWire as Wire] }, { A: true, B: true })
    expect(result.ok).toBe(false)
    expect(result.issues.map(i => i.code)).toContain(code)
  })
  it('detecta auto-conexão e ciclos desconectados da saída', () => {
    const circuit = simple('AND')
    circuit.nodes.push({ id: 'x', kind: 'gate', gate: 'NOT' }, { id: 'y', kind: 'gate', gate: 'NOT' })
    circuit.wires.push(wire('x', 'y'), wire('y', 'x'))
    expect(evaluateCircuit(circuit, { A: false, B: false }).issues.map(i => i.code)).toContain('cycle')
    expect(inspectCircuit({ nodes: circuit.nodes, wires: [wire('g', 'g')] }, false).map(i => i.code)).toContain('cycle')
  })
  it('detecta identificadores repetidos e ausência de saída', () => {
    const circuit = simple('AND')
    circuit.nodes.push(circuit.nodes[0])
    circuit.wires.push(circuit.wires[0])
    expect(inspectCircuit(circuit).filter(i => i.code === 'duplicate')).toHaveLength(2)
    expect(inspectCircuit({ nodes: [], wires: [] })[0].code).toBe('output-count')
  })
})
