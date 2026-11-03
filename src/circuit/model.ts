import type { Circuit, GateKind, Wire } from '../domain/types'

export interface Point { x: number; y: number }
export interface Draft { circuit: Circuit; positions: Record<string, Point> }
export interface EditorRules { inputs: string[]; availableGates: GateKind[]; maxGates: number }

export function createDraft(inputs: string[], maxGates = 7): Draft {
  return {
    circuit: { nodes: [...inputs.map(label => ({ id: label, kind: 'input' as const, label })), { id: 'output', kind: 'output' }], wires: [] },
    positions: Object.fromEntries([...inputs.map((id, i) => [id, { x: 65, y: 65 + i * 168 }]), ['output', { x: 330 + Math.ceil(maxGates / 3) * 210, y: 160 }]]),
  }
}

export function removeGate(draft: Draft, id: string): Draft {
  if (!draft.circuit.nodes.some(node => node.id === id && node.kind === 'gate')) return draft
  const positions = { ...draft.positions }
  delete positions[id]
  return {
    positions,
    circuit: {
      nodes: draft.circuit.nodes.filter(node => node.id !== id),
      wires: draft.circuit.wires.filter(wire => wire.source !== id && wire.target !== id),
    },
  }
}

export function makeWire(source: string, target: string, targetHandle: Wire['targetHandle']): Wire {
  return { id: crypto.randomUUID(), source, target, sourceHandle: 'out', targetHandle }
}
