import { describe, expect, it } from 'vitest'
import { createDraft, makeWire, removeGate } from './model'

describe('edição do circuito', () => {
  it('preserva entradas e saída fixas', () => {
    const draft = createDraft(['A', 'B'])
    expect(removeGate(draft, 'A')).toBe(draft)
    expect(removeGate(draft, 'output')).toBe(draft)
  })
  it('remove uma porta e todos os fios associados sem alterar o original', () => {
    const draft = createDraft(['A', 'B'])
    draft.circuit.nodes.push({ id: 'gate', kind: 'gate', gate: 'NOT' })
    draft.positions.gate = { x: 300, y: 100 }
    draft.circuit.wires.push(makeWire('A', 'gate', 'in1'), makeWire('gate', 'output', 'in1'), makeWire('A', 'B', 'in1'))
    const result = removeGate(draft, 'gate')
    expect(result.circuit.nodes).toHaveLength(3)
    expect(result.circuit.wires).toHaveLength(1)
    expect(result.positions.gate).toBeUndefined()
    expect(draft.circuit.nodes).toHaveLength(4)
    expect(draft.circuit.wires).toHaveLength(3)
  })
})
