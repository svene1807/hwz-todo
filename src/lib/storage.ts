import type { Task } from '@/features/tasks/model'

export const STORAGE_KEY = 'hwz-todo'
export const CURRENT_VERSION = 1

export type State = { version: number; tasks: Task[] }

function emptyState(): State {
  return { version: CURRENT_VERSION, tasks: [] }
}

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.isTrue === 'boolean' &&
    typeof t.done === 'boolean' &&
    (t.lastAnsweredAt === null || typeof t.lastAnsweredAt === 'number') &&
    typeof t.createdAt === 'number'
  )
}

export function hasSavedState(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
}

export function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return emptyState()
    const data: unknown = JSON.parse(raw)
    if (typeof data !== 'object' || data === null) return emptyState()
    const { tasks } = data as { tasks?: unknown }
    if (!Array.isArray(tasks) || !tasks.every(isTask)) return emptyState()
    return { version: CURRENT_VERSION, tasks }
  } catch {
    return emptyState()
  }
}

export function saveState(state: State): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full or blocked: keep working in memory
  }
}
