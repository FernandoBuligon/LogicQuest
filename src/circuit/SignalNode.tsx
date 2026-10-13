import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { Trash2 } from 'lucide-react'
import type { CircuitNode, Signal } from '../domain/types'
import { targetHandles } from '../domain/engine'

export type SignalFlowNode = Node<{
  component: CircuitNode
  signal: Signal
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}, 'signal'>

export default function SignalNode({ data, selected }: NodeProps<SignalFlowNode>) {
  const node = data.component
  const label = node.kind === 'gate' ? node.gate : node.kind === 'input' ? node.label : 'Saída'
  const value = data.signal === null ? '?' : Number(data.signal)
  return <div className={`signal-node ${node.kind} ${selected ? 'selected' : ''}`} data-signal={value}>
    {targetHandles(node).map((handle, i, handles) => <Handle key={handle} type="target" id={handle}
      position={Position.Left} style={{ top: handles.length === 1 ? '50%' : i === 0 ? '32%' : '72%' }}
      aria-label={`Entrada ${i + 1} de ${label}`} data-testid={`handle-${node.id}-${handle}`} />)}
    <span className="node-caption">{node.kind === 'input' ? 'Interruptor' : node.kind === 'gate' ? 'Porta lógica' : 'Resultado'}</span>
    <div className="node-body"><strong>{label}</strong><span className="signal-value" aria-label={`Sinal ${label}: ${value}`}>{value}</span></div>
    {node.kind === 'input' && <button className="nodrag nopan toggle-input" onClick={() => data.onToggle(node.id)} aria-label={`Alternar entrada ${label}`} aria-pressed={data.signal === true}>Alternar 0 / 1</button>}
    {node.kind === 'gate' && <button className="nodrag nopan remove-gate" onClick={() => data.onRemove(node.id)} aria-label={`Remover porta ${label}`}><Trash2 size={14} aria-hidden="true" /></button>}
    {node.kind !== 'input' && <div className="handle-labels">{targetHandles(node).map((handle, i) => <span key={handle} style={{ top: node.kind === 'gate' && node.gate !== 'NOT' ? i === 0 ? '32%' : '72%' : '50%' }}>{i + 1}</span>)}</div>}
    {node.kind !== 'output' && <Handle type="source" id="out" position={Position.Right} aria-label={`Saída de ${label}`} data-testid={`handle-${node.id}-out`} />}
  </div>
}
