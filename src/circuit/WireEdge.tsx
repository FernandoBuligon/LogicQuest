import { BaseEdge, EdgeToolbar, getSmoothStepPath, type Edge, type EdgeProps } from '@xyflow/react'
import { Trash2 } from 'lucide-react'

export type WireFlowEdge = Edge<{ onRemove: () => void; number: number }, 'wire'>

export default function WireEdge(props: EdgeProps<WireFlowEdge>) {
  const [path, labelX, labelY] = getSmoothStepPath(props)
  return <>
    <BaseEdge id={props.id} path={path} style={props.style} interactionWidth={28}
      label={props.selected ? undefined : props.label} labelX={labelX} labelY={labelY}
      labelStyle={props.labelStyle} labelBgStyle={props.labelBgStyle} />
    <EdgeToolbar edgeId={props.id} x={labelX} y={labelY} isVisible={props.selected} style={{ zIndex: 10 }}>
      <button className="wire-remove nodrag nopan"
        aria-label={`Remover ligação ${props.data?.number}`} title="Remover ligação"
        onClick={event => { event.stopPropagation(); const canvas = event.currentTarget.closest<HTMLElement>('.circuit-canvas'); props.data?.onRemove(); canvas?.focus() }}>
        <Trash2 aria-hidden="true" size={16} />Remover
      </button>
    </EdgeToolbar>
  </>
}
