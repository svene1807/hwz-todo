import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTasks } from '@/features/tasks/useTasks'
import { CURRENT_VERSION, loadState, saveState } from '@/lib/storage'

describe('useTasks', () => {
  it('starts with 20 example statements on first start and asks one of them', () => {
    const { result } = renderHook(() => useTasks())
    expect(result.current.tasks).toHaveLength(20)
    expect(result.current.current?.id).toBe(result.current.tasks[0].id)
    expect(loadState().tasks).toHaveLength(20)
  })

  it('does not bring the examples back when everything was deleted', () => {
    saveState({ version: CURRENT_VERSION, tasks: [] })
    const { result } = renderHook(() => useTasks())
    expect(result.current.tasks).toEqual([])
    expect(result.current.current).toBeUndefined()
  })

  it('keeps added and answered statements after a reload', () => {
    const first = renderHook(() => useTasks())
    act(() => first.result.current.add('Wasser kocht auf Meereshöhe bei 100 °C', true))
    const added = first.result.current.tasks[0]
    act(() => {
      first.result.current.answer(added.id, true)
    })
    first.unmount()

    const second = renderHook(() => useTasks())
    expect(second.result.current.tasks).toHaveLength(21)
    expect(second.result.current.tasks[0]).toMatchObject({
      title: added.title,
      isTrue: true,
      done: true,
    })
  })

  it('tells whether an answer was correct and moves on with next', () => {
    const { result } = renderHook(() => useTasks())
    const current = result.current.current
    if (!current) throw new Error('expected a task')
    let correct = false
    act(() => {
      correct = result.current.answer(current.id, current.isTrue)
    })
    expect(correct).toBe(true)
    act(() => result.current.next())
    expect(result.current.current?.id).not.toBe(current.id)
  })

  it('removes and restores a statement', () => {
    const { result } = renderHook(() => useTasks())
    const target = result.current.tasks[2]
    let removed: ReturnType<typeof result.current.remove>
    act(() => {
      removed = result.current.remove(target.id)
    })
    expect(result.current.tasks).toHaveLength(19)
    act(() => {
      if (removed) result.current.restore(removed.task, removed.index)
    })
    expect(result.current.tasks[2]).toEqual(target)
  })
})
