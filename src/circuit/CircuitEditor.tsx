import { useRef, useState } from 'react'
import { Background, Controls, ReactFlow, type Connection, type Edge, type NodeChange } from '@xyflow/react'
import { ArrowLeft, FlaskConical, Plus, RotateCcw } from 'lucide-react'
import '@xyflow/react/dist/style.css'
import { Button } from '../components/ui/button'
import { connectionIssue, evaluateCircuit, targetHandles } from '../domain/engine'
import type { Circuit, GateKind, InputHandle, InputValues, Wire } from '../domain/types'
import { createDraft, makeWire, removeGate, type Draft, type EditorRules } from './model'
import SignalNode, { type SignalFlowNode } from './SignalNode'

const nodeTypes = { signal: SignalNode }
interface EditorProps {
  rules: EditorRules
  initialDraft?: Draft
  onDraftChange?: (draft: Draft) => void
  onBack: () => void
  onTest: (circuit: Circuit) => void
}

export default function CircuitEditor({ rules, initialDraft, onDraftChange, onBack, onTest }: EditorProps) {
  const [draft, setDraft] = useState(() => initialDraft ?? createDraft(rules.inputs))
  const draftRef = useRef(draft)
  const [inputs, setInputs] = useState<InputValues>(() => Object.fromEntries(rules.inputs.map(id => [id, false])))
  const [message, setMessage] = useState('Adicione uma porta e conecte os pontos de saída aos pontos de entrada.')
  const [source, setSource] = useState(rules.inputs[0])
  const [destination, setDestination] = useState('output:in1')
  const [selection, setSelection] = useState<{ nodes: string[]; wires: string[] }>({ nodes: [], wires: [] })
  const [measurements, setMeasurements] = useState<Record<string, { width?: number; height?: number }>>({})
  const counter = useRef(0)
  const evaluation = evaluateCircuit(draft.circuit, inputs)
  const gates = draft.circuit.nodes.filter(node => node.kind === 'gate')
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
      positions: { ...draft.positions, [id]: { x: 330 + Math.floor(index / 2) * 210, y: 100 + (index % 2) * 180 } },
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
      style: { stroke: signal === true ? '#6ee7b7' : '#94a3b8', strokeWidth: 3 },
      labelStyle: { fill: '#0f172a', fontWeight: 800 }, labelBgStyle: { fill: signal === true ? '#6ee7b7' : '#cbd5e1' },
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
    <div className="editor-toolbar">
      <Button variant="ghost" onClick={onBack}><ArrowLeft size={16} />Voltar</Button>
      <div className="gate-palette" aria-label="Portas disponíveis">{rules.availableGates.map(gate => <Button key={gate} variant="outline" disabled={gates.length >= rules.maxGates} onClick={() => addGate(gate)}><Plus size={15} />{gate}</Button>)}</div>
      <span className="gate-count">{gates.length} / {rules.maxGates} portas</span>
    </div>
    <div className="circuit-canvas">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={changeNodes}
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
        fitView fitViewOptions={{ padding: 0.2, maxZoom: 1 }} minZoom={0.35} maxZoom={1.7}
        deleteKeyCode={['Backspace', 'Delete']} colorMode="dark" snapToGrid snapGrid={[10, 10]}>
        <Background gap={24} size={1} /><Controls showInteractive={false} />
      </ReactFlow>
    </div>
    <div className="editor-status"><span>Saída atual: <strong data-testid="output-value">{output}</strong></span><span>{evaluation.ok ? 'Circuito completo · simulação ao vivo' : evaluation.issues[0]?.message}</span></div>
    <p className="connection-message" role="status">{message}</p>
    <details className="connection-tools"><summary>Conectar por seleção / remover fios</summary>
      <form className="connection-form" onSubmit={event => {
        event.preventDefault()
        const [target, handle] = safeDestination.split(':')
        connect({ source: safeSource, sourceHandle: 'out', target, targetHandle: handle })
      }}>
        <label>Origem<select aria-label="Origem" value={safeSource} onChange={event => setSource(event.target.value)}>{sources.map(node => <option key={node.id} value={node.id}>{node.kind === 'input' ? `Entrada ${node.label}` : node.kind === 'gate' ? `Porta ${node.gate} ${gates.findIndex(g => g.id === node.id) + 1}` : ''}</option>)}</select></label>
        <label>Destino<select aria-label="Destino" value={safeDestination} onChange={event => setDestination(event.target.value)}>{draft.circuit.nodes.flatMap(node => targetHandles(node).map((handle, i) => <option key={`${node.id}:${handle}`} value={`${node.id}:${handle}`}>{node.kind === 'output' ? 'Saída' : node.kind === 'gate' ? `Porta ${node.gate} ${gates.findIndex(g => g.id === node.id) + 1}` : ''} · entrada {i + 1}</option>))}</select></label>
        <Button variant="outline" type="submit">Conectar fio</Button>
      </form>
      <ul className="wire-list">{draft.circuit.wires.map((wire, i) => <li key={wire.id}>Fio {i + 1} <Button size="sm" variant="ghost" onClick={() => update({ ...draft, circuit: { ...draft.circuit, wires: draft.circuit.wires.filter(item => item.id !== wire.id) } })} aria-label={`Remover fio ${i + 1}`}>Remover</Button></li>)}</ul>
      {draft.circuit.wires.length === 0 && <p>Nenhum fio conectado.</p>}
    </details>
    <div className="editor-actions"><Button onClick={() => onTest(draft.circuit)}><FlaskConical size={18} />Testar circuito</Button>
      <Button variant="outline" onClick={() => { update(createDraft(rules.inputs)); setMessage('Circuito limpo. Adicione uma porta para começar novamente.') }}><RotateCcw size={16} />Reiniciar fase</Button></div>
  </section>
}
