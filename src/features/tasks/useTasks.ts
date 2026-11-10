import { useCallback, useEffect, useState } from 'react'
import {
  type Task,
  addTask,
  answerTask,
  createSeedTasks,
  nextTask,
  removeTask,
  restoreTask,
} from '@/features/tasks/model'
import { CURRENT_VERSION, hasSavedState, loadState, saveState } from '@/lib/storage'

function initialTasks(): Task[] {
  return hasSavedState() ? loadState().tasks : createSeedTasks()
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [currentId, setCurrentId] = useState<string | null>(null)

  useEffect(() => {
    saveState({ version: CURRENT_VERSION, tasks })
  }, [tasks])

  const current = tasks.find((t) => t.id === currentId) ?? nextTask(tasks, null)

  const add = useCallback((title: string, isTrue: boolean) => {
    setTasks((prev) => addTask(prev, title, isTrue))
  }, [])

  const answer = useCallback(
    (id: string, value: boolean): boolean => {
      const task = tasks.find((t) => t.id === id)
      setCurrentId(id)
      setTasks((prev) => answerTask(prev, id, value))
      return task?.isTrue === value
    },
    [tasks],
  )

  const next = useCallback(() => {
    setCurrentId(nextTask(tasks, current?.id ?? null)?.id ?? null)
  }, [tasks, current])

  const remove = useCallback(
    (id: string) => {
      const { tasks: rest, removed } = removeTask(tasks, id)
      setTasks(rest)
      return removed
    },
    [tasks],
  )

  const restore = useCallback((task: Task, index: number) => {
    setTasks((prev) => restoreTask(prev, task, index))
  }, [])

  return { tasks, current, add, answer, next, remove, restore }
}
