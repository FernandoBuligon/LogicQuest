import { describe, expect, it } from 'vitest'
import { initialProgress, loadProgress, parseProgress, PROGRESS_KEY, saveProgress, type ProgressStorage } from './progress'

describe('progresso versionado', () => {
  it.each([null, '', '{bad', 'null', '[]', 'true', '{}', '{"version":2,"completed":[]}', '{"version":1,"completed":["1"]}', '{"version":1,"completed":[0]}', '{"version":1,"completed":[12]}', '{"version":1,"completed":[1.5]}', '{"version":1,"completed":[2]}'])('recupera dados ausentes/corrompidos: %s', raw => {
    expect(parseProgress(raw)).toEqual(initialProgress())
  })
  it('normaliza duplicatas e ordem e preserva a última fase disponível', () => {
    expect(parseProgress(JSON.stringify({ version: 1, completed: [2, 1, 1], lastLevel: 3 }))).toEqual({ version: 1, completed: [1, 2], lastLevel: 3 })
  })
  it('preserva progresso da versão anterior e aceita a trilha completa', () => {
    const completed = [1, 2, 3, 4, 5, 6]
    expect(parseProgress(JSON.stringify({ version: 1, completed, lastLevel: 7 }))).toEqual({ version: 1, completed, lastLevel: 7 })
    const all = Array.from({ length: 11 }, (_, i) => i + 1)
    expect(parseProgress(JSON.stringify({ version: 1, completed: all, lastLevel: 11 }))).toEqual({ version: 1, completed: all, lastLevel: 11 })
  })
  it('não retoma uma fase bloqueada ou inexistente', () => {
    for (const lastLevel of [6, 0, 1.5, '2', null]) expect(parseProgress(JSON.stringify({ version: 1, completed: [1], lastLevel })).lastLevel).toBe(1)
  })
  it('persiste e recupera os dados na chave correta', () => {
    const data = new Map<string, string>()
    const storage: ProgressStorage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => { data.set(key, value) } }
    const progress = { version: 1 as const, completed: [1, 2], lastLevel: 3 }
    expect(saveProgress(progress, storage)).toBe(true)
    expect(data.has(PROGRESS_KEY)).toBe(true)
    expect(loadProgress(storage)).toEqual({ progress, available: true })
    expect(saveProgress(initialProgress(), storage)).toBe(true)
    expect(loadProgress(storage).progress).toEqual(initialProgress())
  })
  it('não quebra quando o armazenamento está indisponível ou cheio', () => {
    const storage: ProgressStorage = { getItem: () => { throw new Error('bloqueado') }, setItem: () => { throw new Error('cheio') } }
    expect(loadProgress(storage)).toEqual({ progress: initialProgress(), available: false })
    expect(saveProgress(initialProgress(), storage)).toBe(false)
    expect(loadProgress(null).available).toBe(false)
    expect(saveProgress(initialProgress(), null)).toBe(false)
  })
})
