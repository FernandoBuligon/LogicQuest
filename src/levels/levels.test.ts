import { describe, expect, it } from 'vitest'
import { isUnlocked, levels } from './levels'
import { inputCombinations, validateSolution } from '../domain/validation'
import { createDraft } from '../circuit/model'
import { solutions } from '../../tests/fixtures/solutions'

function reference(index: number) {
  const circuit = createDraft(levels[index].inputs).circuit
  const solution = solutions[index]
  solution.gates.forEach((gate, i) => circuit.nodes.push({ id: String(i + 1), kind: 'gate', gate }))
  solution.wires.forEach(([source, target, input], i) => circuit.wires.push({ id: `wire-${i}`, source, target, sourceHandle: 'out', targetHandle: input === 1 ? 'in1' : 'in2' }))
  return circuit
}

describe('trilha com quatro tutoriais e sete fases de prática', () => {
  it.each(levels.map((level, index) => [level.name, index] as const))('aprova todas as combinações da solução de %s', (_name, index) => {
    const result = validateSolution(reference(index), levels[index])
    expect(result.status, JSON.stringify(result)).toBe('passed')
    expect(result.rows).toHaveLength(2 ** levels[index].inputs.length)
  })
  it.each(levels.map((level, index) => [level.name, index] as const))('rejeita solução incorreta de %s', (_name, index) => {
    const circuit = reference(index)
    circuit.wires.find(wire => wire.target === 'output')!.source = levels[index].inputs[0]
    expect(validateSolution(circuit, levels[index]).status).toBe('incorrect')
  })
  it('libera as onze etapas em sequência e permite revisitar concluídas', () => {
    expect(levels).toHaveLength(11)
    expect(levels.filter(level => level.module === 'tutorial')).toHaveLength(4)
    expect(levels.filter(level => level.module === 'challenge')).toHaveLength(5)
    for (const level of levels) {
      const previous = Array.from({ length: level.id - 1 }, (_, i) => i + 1)
      expect(isUnlocked(level.id, previous)).toBe(true)
      if (level.id > 1) expect(isUnlocked(level.id, previous.slice(1))).toBe(false)
    }
    expect(isUnlocked(12, levels.map(level => level.id))).toBe(false)
    expect(isUnlocked(1, [1, 2])).toBe(true)
  })
  it('respeita os casos de fronteira dos novos problemas', () => {
    const countOn = (id: number) => inputCombinations(levels[id - 1].inputs).filter(levels[id - 1].expected).length
    expect(countOn(7)).toBe(4) // 3 pares e os 3 votos juntos.
    expect(countOn(8)).toBe(4)
    expect(countOn(9)).toBe(8)
    expect(countOn(10)).toBe(4) // 00=00, 01=01, 10=10, 11=11.
    expect(countOn(11)).toBe(4) // 3 casos automáticos + 1 manual, todos sem trava.
    expect(levels[10].expected({ A: true, B: true, C: false, D: true })).toBe(false)
    expect(levels[6].expected({ A: true, B: true, C: true })).toBe(true)
  })
})
