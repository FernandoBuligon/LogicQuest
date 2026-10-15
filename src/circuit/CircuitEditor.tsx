import { useEffect, useRef, useState } from 'react'
import { Background, Controls, ReactFlow, type Connection, type Edge, type NodeChange, type ReactFlowInstance } from '@xyflow/react'
import { ArrowLeft, FlaskConical, Plus, RotateCcw, X } from 'lucide-react'
import '@xyflow/react/dist/style.css'
import { Button } from '../components/ui/button'
import { connectionIssue, evaluateCircuit, targetHandles } from '../domain/engine'
import type { Circuit, GateKind, InputHandle, InputValues, Wire } from '../domain/types'
import { createDraft, makeWire, removeGate, type Draft, type EditorRules } from './model'
import SignalNode, { type SignalFlowNode } from './SignalNode'
import GateSymbol from '../components/GateSymbol'

const nodeTypes = { signal: SignalNode }
interface EditorProps {
  rules: EditorRules
  initialDraft?: Draft
  onDraftChange?: (draft: Draft) => void
  onBack: () => void
  onTest: (circuit: Circuit) => void
}

export default function CircuitEditor({ rules, initialDraft, onDraftChange, onBack, onTest }: EditorProps) {
  const [draft, setDraft] = useState(() => initialDraft ?? createDraft(rules.inputs, rules.maxGates))
  const draftRef = useRef(draft)
  const [inputs, setInputs] = useState<InputValues>(() => Object.fromEntries(rules.inputs.map(id => [id, false])))
  const [message, setMessage] = useState('Adicione uma porta e conecte os pontos de saída aos pontos de entrada.')
  const [source, setSource] = useState(rules.inputs[0])
  const [destination, setDestination] = useState('output:in1')
  const [selection, setSelection] = useState<{ nodes: string[]; wires: string[] }>({ nodes: [], wires: [] })
  const [measurements, setMeasurements] = useState<Record<string, { width?: number; height?: number }>>({})
  const counter = useRef(initialDraft?.circuit.nodes.filter(node => node.kind === 'gate').length ?? 0)
  const [flow, setFlow] = useState<ReactFlowInstance<SignalFlowNode, Edge> | null>(null)
  const connectionsRef = useRef<HTMLDetailsElement>(null)
  const evaluation = evaluateCircuit(draft.circuit, inputs)
  const gates = draft.circuit.nodes.filter(node => node.kind === 'gate')
  useEffect(() => {
    const timer = window.setTimeout(() => { void flow?.fitView({ padding: 0.18, maxZoom: 1, duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180 }) }, 90)
    return () => window.clearTimeout(timer)
  }, [flow, gates.length])
  const sources = draft.circuit.nodes.filter(node => node.kind !== 'output')
  const destinations = draft.circuit.nodes.flatMap(node => targetHandles(node).map(handle => `${node.id}:${handle}`))
  const safeSource = sources.some(node => node.id === source) ? source : rules.inputs[0]
  const safeDestination = destinations.includes(destination) ? destination : 'output:in1'
  function update(change: Draft | ((current: Draft) => Draft)) {
    const next = typeof change === 'function' ? change(draftRef.current) : change
    draftRef.current = next
    setDraft(next)
    onDraftChange?.(next)
  }
  function remove(id: string) { update(removeGate(draft, id)) }
  function addGate(gate: GateKind) {
    if (gates.length >= rules.maxGates) {
      setMessage(`Limite de ${rules.maxGates} portas atingido. Remova uma porta para adicionar outra.`)
      return
    }
    const id = `gate-${gate.toLowerCase()}-${crypto.randomUUID()}`
    const index = counter.current++ % rules.maxGates
    update({
      circuit: { ...draft.circuit, nodes: [...draft.circuit.nodes, { id, kind: 'gate', gate }] },
      positions: { ...draft.positions, [id]: { x: 330 + Math.floor(index / 3) * 210, y: 80 + (index % 3) * 160 } },
    })
    setMessage(`Porta ${gate} adicionada. Conecte ${gate === 'NOT' ? 'sua entrada' : 'as duas entradas'} e sua saída.`)
  }
  function connect(connection: Connection) {
    const wire: Wire = { ...makeWire(connection.source, connection.target, connection.targetHandle as InputHandle), sourceHandle: connection.sourceHandle as 'out' }
    const issue = connectionIssue(draft.circuit, wire)
    if (issue) { setMessage(issue.message); return }
    update({ ...draft, circuit: { ...draft.circuit, wires: [...draft.circuit.wires, wire] } })
    setMessage('Fio conectado. Altere os interruptores para observar o sinal.')
  }
  const nodes: SignalFlowNode[] = draft.circuit.nodes.map(component => ({
    id: component.id, type: 'signal', position: draft.positions[component.id],
    measured: measurements[component.id],
    deletable: component.kind === 'gate', draggable: component.kind === 'gate', selected: selection.nodes.includes(component.id),
    data: { component, signal: evaluation.nodeSignals[component.id], onRemove: remove, onToggle: id => setInputs({ ...inputs, [id]: !inputs[id] }) },
    ariaLabel: component.kind === 'gate' ? `Porta ${component.gate}` : component.kind === 'input' ? `Entrada ${component.label}` : 'Saída do circuito',
  }))
  const edges: Edge[] = draft.circuit.wires.map(wire => {
    const signal = evaluation.wireSignals[wire.id]
    return { ...wire, selected: selection.wires.includes(wire.id), type: 'smoothstep', label: signal === null ? '?' : String(Number(signal)),
      style: { stroke: signal === true ? 'var(--signal)' : 'var(--border-control)', strokeWidth: 2 },
      labelStyle: { fill: 'var(--text)', fontWeight: 600 }, labelBgStyle: { fill: signal === true ? 'var(--signal-soft)' : 'var(--surface-subtle)' },
      ariaLabel: `Fio ${wire.source} para ${wire.target}, sinal ${signal === null ? 'desconhecido' : Number(signal)}`,
    }
  })
  function changeNodes(changes: NodeChange<SignalFlowNode>[]) {
    for (const change of changes) {
      if (change.type === 'dimensions' && change.dimensions) {
        setMeasurements(current => ({ ...current, [change.id]: change.dimensions! }))
      }
      if (change.type === 'select') {
        setSelection(current => ({ ...current, nodes: change.selected ? [...current.nodes.filter(id => id !== change.id), change.id] : current.nodes.filter(id => id !== change.id) }))
      }
    }
    if (!changes.some(change => change.type === 'remove' || change.type === 'position')) return
    update(current => {
      let next = current
      for (const change of changes) {
        if (change.type === 'remove') next = removeGate(next, change.id)
        if (change.type === 'position' && change.position) next = { ...next, positions: { ...next.positions, [change.id]: change.position } }
      }
      return next
    })
  }
  const output = evaluation.output === null ? '?' : Number(evaluation.output)
  return <section className="editor-section" aria-label="Editor de circuitos">
    <div className="editor-toolbar"><span className="palette-label">Portas</span>
      <Button className="editor-back" size="sm" variant="ghost" aria-label="Voltar para a trilha" onClick={onBack}><ArrowLeft aria-hidden="true" size={16} />Voltar</Button>
      <div className="gate-palette" aria-label="Portas disponíveis">{rules.availableGates.map(gate => <Button key={gate} className={`palette-gate gate-${gate.toLowerCase()}`} variant="outline" disabled={gates.length >= rules.maxGates} onClick={() => addGate(gate)}><GateSymbol gate={gate} size={25} />{gate}<Plus aria-hidden="true" size={12} /></Button>)}</div>
      <span className="gate-count">{gates.length} / {rules.maxGates} portas</span>
    </div>
    <div className="circuit-canvas">
      <ReactFlow onInit={setFlow} nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={changeNodes}
        ariaLabelConfig={{
          'controls.zoomIn.ariaLabel': 'Aumentar zoom', 'controls.zoomOut.ariaLabel': 'Diminuir zoom',
          'controls.fitView.ariaLabel': 'Enquadrar circuito', 'controls.ariaLabel': 'Controles do circuito',
          'node.a11yDescription.default': 'Pressione Enter para selecionar, use as setas para mover uma porta e Delete para removê-la. Escape cancela a seleção.',
          'edge.a11yDescription.default': 'Pressione Enter para selecionar o fio, Delete para remover e Escape para cancelar.',
        }}
        onEdgesChange={changes => {
          for (const change of changes) {
            if (change.type === 'select') setSelection(current => ({ ...current, wires: change.selected ? [...current.wires.filter(id => id !== change.id), change.id] : current.wires.filter(id => id !== change.id) }))
          }
          const removed = changes.filter(change => change.type === 'remove').map(change => change.id)
          if (removed.length) update(current => ({ ...current, circuit: { ...current.circuit, wires: current.circuit.wires.filter(wire => !removed.includes(wire.id)) } }))
        }}
        onConnect={connect} isValidConnection={connection => !connectionIssue(draft.circuit, {
          id: 'candidate', source: connection.source, target: connection.target,
          sourceHandle: connection.sourceHandle as 'out', targetHandle: connection.targetHandle as InputHandle,
        })}
        onConnectEnd={(_event, state) => {
          if (!state.isValid) setMessage('Ligação recusada. Conecte saída → entrada livre; o fio não pode voltar à própria porta ou criar ciclos.')
        }}
        fitView fitViewOptions={{ padding: 0.2, maxZoom: 1 }} minZoom={0.12} maxZoom={1.7}
        deleteKeyCode={['Backspace', 'Delete']} colorMode="light" snapToGrid snapGrid={[10, 10]}>
        <Background gap={24} size={1} color="var(--border)" /><Controls showInteractive={false} orientation="horizontal" position="bottom-right" />
      </ReactFlow>
    </div>
    <div className="editor-status"><span aria-live="polite" aria-atomic="true">Saída atual: <strong data-testid="output-value">{output}</strong></span><div className="input-controls" aria-label="Simular entradas">{rules.inputs.map(id => <button key={id} aria-label={`Simular entrada ${id}`} aria-pressed={inputs[id]} onClick={() => setInputs(current => ({ ...current, [id]: !current[id] }))}>{id}<span>{Number(inputs[id])}</span></button>)}</div></div>
    <p className="connection-message" role="status">{message}</p>
    <details ref={connectionsRef} className="connection-tools" onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget as HTMLElement | null)) event.currentTarget.open = false
    }} onKeyDown={event => {
      if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus() }
    }}><summary>Conectar por seleção / remover fios</summary>
      <button className="close-button" aria-label="Fechar conexões" onClick={() => { if (connectionsRef.current) { connectionsRef.current.open = false; connectionsRef.current.querySelector('summary')?.focus() } }}><X aria-hidden="true" size={16} /></button>
      <form className="connection-form" onSubmit={event => {
        event.preventDefault()
        const [target, handle] = safeDestination.split(':')
        connect({ source: safeSource, sourceHandle: 'out', target, targetHandle: handle })
      }}>
        <label>Origem<select name="source" autoComplete="off" aria-label="Origem" value={safeSource} onChange={event => setSource(event.target.value)}>{sources.map(node => <option key={node.id} value={node.id}>{node.kind === 'input' ? `Entrada ${node.label}` : node.kind === 'gate' ? `Porta ${node.gate} ${gates.findIndex(g => g.id === node.id) + 1}` : ''}</option>)}</select></label>
        <label>Destino<select name="destination" autoComplete="off" aria-label="Destino" value={safeDestination} onChange={event => setDestination(event.target.value)}>{draft.circuit.nodes.flatMap(node => targetHandles(node).map((handle, i) => <option key={`${node.id}:${handle}`} value={`${node.id}:${handle}`}>{node.kind === 'output' ? 'Saída' : node.kind === 'gate' ? `Porta ${node.gate} ${gates.findIndex(g => g.id === node.id) + 1}` : ''} · entrada {i + 1}</option>))}</select></label>
        <Button variant="outline" type="submit">Conectar fio</Button>
      </form>
      <ul className="wire-list">{draft.circuit.wires.map((wire, i) => <li key={wire.id}>Fio {i + 1} <Button size="sm" variant="ghost" onClick={() => update({ ...draft, circuit: { ...draft.circuit, wires: draft.circuit.wires.filter(item => item.id !== wire.id) } })} aria-label={`Remover fio ${i + 1}`}>Remover</Button></li>)}</ul>
      {draft.circuit.wires.length === 0 && <p>Nenhum fio conectado.</p>}
    </details>
    <div className="editor-actions"><Button variant="ghost" onClick={() => { counter.current = 0; update(createDraft(rules.inputs, rules.maxGates)); setMessage('Circuito limpo. Adicione uma porta para começar novamente.') }}><RotateCcw aria-hidden="true" size={16} /><span>Reiniciar fase</span></Button><Button onClick={() => { if (connectionsRef.current) connectionsRef.current.open = false; onTest(draft.circuit) }}><FlaskConical aria-hidden="true" size={18} />Testar circuito</Button></div>
  </section>
}
