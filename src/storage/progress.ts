import { isUnlocked, levels } from '../levels/levels'

export const PROGRESS_KEY = 'logic-quest:progress:v1'
export interface Progress { version: 1; completed: number[]; lastLevel: number }
export interface ProgressStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }
export const initialProgress = (): Progress => ({ version: 1, completed: [], lastLevel: 1 })

function browserStorage(): ProgressStorage | null {
  try { return typeof window === 'undefined' ? null : window.localStorage } catch { return null }
}

export function parseProgress(raw: string | null): Progress {
  if (!raw) return initialProgress()
  try {
    const data: unknown = JSON.parse(raw)
    if (!data || typeof data !== 'object' || !('version' in data) || data.version !== 1 || !('completed' in data) || !Array.isArray(data.completed)) return initialProgress()
    if (!data.completed.every(id => typeof id === 'number' && Number.isInteger(id) && levels.some(level => level.id === id))) return initialProgress()
    const completed = [...new Set<number>(data.completed)].sort((a, b) => a - b)
    if (completed.some((id, i) => id !== i + 1)) return initialProgress()
    const lastLevel = 'lastLevel' in data && typeof data.lastLevel === 'number' && isUnlocked(data.lastLevel, completed) ? data.lastLevel : 1
    return { version: 1, completed, lastLevel }
  } catch { return initialProgress() }
}

export function loadProgress(storage: ProgressStorage | null = browserStorage()): { progress: Progress; available: boolean } {
  if (!storage) return { progress: initialProgress(), available: false }
  try { return { progress: parseProgress(storage.getItem(PROGRESS_KEY)), available: true } }
  catch { return { progress: initialProgress(), available: false } }
}

export function saveProgress(progress: Progress, storage: ProgressStorage | null = browserStorage()): boolean {
  if (!storage) return false
  try { storage.setItem(PROGRESS_KEY, JSON.stringify(progress)); return true }
  catch { return false }
}
