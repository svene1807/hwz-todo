import { describe, expect, it } from 'vitest'
import { CURRENT_VERSION, STORAGE_KEY, hasSavedState, loadState, saveState } from '@/lib/storage'
import type { Task } from '@/features/tasks/model'

const task: Task = {
  id: '1',
  title: 'Spinnen sind Insekten',
  isTrue: false,
  done: true,
  lastAnsweredAt: 5,
  createdAt: 1,
}

describe('storage', () => {
  it('returns an empty list when nothing is saved', () => {
    expect(hasSavedState()).toBe(false)
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('returns an empty list for broken JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{kaputt')
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('returns an empty list for a wrong shape', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, tasks: [{ id: 1, title: null }] }),
    )
    expect(loadState().tasks).toEqual([])
  })

  it('saves and loads the state', () => {
    saveState({ version: CURRENT_VERSION, tasks: [task] })
    expect(hasSavedState()).toBe(true)
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [task] })
  })
})
