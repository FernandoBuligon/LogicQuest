import { describe, expect, it } from 'vitest'
import { isUnlocked, levels } from './levels'
import { validateSolution } from '../domain/validation'
import { createDraft } from '../circuit/model'
import type { Circuit, GateKind, InputHandle } from '../domain/types'

function reference(index: number): Circuit {
  const level = levels[index]
  const circuit = createDraft(level.inputs).circuit
  const add = (id: string, gate: GateKind) => circuit.nodes.push({ id, kind: 'gate', gate })
  const wire = (source: string, target: string, targetHandle: InputHandle = 'in1') => circuit.wires.push({ id: `${source}-${target}-${targetHandle}`, source, target, sourceHandle: 'out' as const, targetHandle })
  if (index < 4) {
    add('g', level.availableGates[0]); wire('A', 'g')
    if (index !== 2) wire('B', 'g', 'in2')
    wire('g', 'output')
  } else {
    add('first', index === 4 ? 'AND' : 'XOR')
    add('not', 'NOT'); add('or', 'OR')
    wire('A', 'first'); wire('B', 'first', 'in2')
    wire(index === 4 ? 'C' : 'D', 'not')
    if (index === 5) { add('and', 'AND'); wire('first', 'and'); wire('C', 'and', 'in2') }
    wire(index === 4 ? 'first' : 'and', 'or'); wire('not', 'or', 'in2'); wire('or', 'output')
  }
  return circuit
}

describe('seis fases declarativas', () => {
  it.each(levels.map((level, index) => [level.name, index] as const))('aprova todas as combinações da solução de %s', (_name, index) => {
    const result = validateSolution(reference(index), levels[index])
    expect(result.status).toBe('passed')
    expect(result.rows).toHaveLength(2 ** levels[index].inputs.length)
  })
  it.each(levels.map((level, index) => [level.name, index] as const))('rejeita solução incorreta de %s', (_name, index) => {
    const circuit = reference(index)
    circuit.wires.find(wire => wire.target === 'output')!.source = 'A'
    expect(validateSolution(circuit, levels[index]).status).toBe('incorrect')
  })
  it('bloqueia fases futuras e permite revisitar concluídas', () => {
    expect(isUnlocked(1, [])).toBe(true)
    expect(isUnlocked(2, [])).toBe(false)
    expect(isUnlocked(2, [1])).toBe(true)
    expect(isUnlocked(1, [1, 2])).toBe(true)
    expect(isUnlocked(6, [1, 2, 3, 4, 5])).toBe(true)
    expect(isUnlocked(6, [5])).toBe(false)
    expect(isUnlocked(7, [1, 2, 3, 4, 5, 6])).toBe(false)
  })
})
