import { describe, expect, it } from 'vitest'
import {
  MAX_TITLE_LENGTH,
  type Task,
  addTask,
  answerTask,
  createSeedTasks,
  nextTask,
  removeTask,
  restoreTask,
} from '@/features/tasks/model'

function makeTask(id: string, overrides: Partial<Task> = {}): Task {
  return {
    id,
    title: id,
    isTrue: true,
    done: false,
    lastAnsweredAt: null,
    createdAt: 0,
    ...overrides,
  }
}

describe('addTask', () => {
  it('ignores an empty or whitespace-only title', () => {
    expect(addTask([], '', true)).toEqual([])
    expect(addTask([], '   ', false)).toEqual([])
  })

  it('trims the title and adds the task at the top', () => {
    const existing = [makeTask('a')]
    const result = addTask(existing, '  Bern ist die Bundesstadt  ', true)
    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({
      title: 'Bern ist die Bundesstadt',
      isTrue: true,
      done: false,
      lastAnsweredAt: null,
    })
    expect(result[1]).toBe(existing[0])
  })

  it('cuts the title to 200 characters', () => {
    const result = addTask([], 'x'.repeat(250), false)
    expect(result[0].title).toHaveLength(MAX_TITLE_LENGTH)
  })
})

describe('answerTask', () => {
  it('marks a correct answer as done and stores the time', () => {
    const result = answerTask([makeTask('a', { isTrue: false })], 'a', false, 1000)
    expect(result[0]).toMatchObject({ done: true, lastAnsweredAt: 1000 })
  })

  it('marks a wrong answer as not done', () => {
    const result = answerTask([makeTask('a', { isTrue: true, done: true })], 'a', false, 2000)
    expect(result[0]).toMatchObject({ done: false, lastAnsweredAt: 2000 })
  })
})

describe('nextTask', () => {
  it('returns undefined without tasks', () => {
    expect(nextTask([], null)).toBeUndefined()
  })

  it('brings wrong answers before never answered and correct ones', () => {
    const tasks = [
      makeTask('correct', { done: true, lastAnsweredAt: 10 }),
      makeTask('new'),
      makeTask('wrong', { done: false, lastAnsweredAt: 20 }),
    ]
    expect(nextTask(tasks, null)?.id).toBe('wrong')
  })

  it('brings all three wrong answers back before any correct one', () => {
    let tasks = ['c1', 'c2', 'w1', 'w2', 'w3'].map((id) => makeTask(id))
    tasks = answerTask(tasks, 'c1', true, 1)
    tasks = answerTask(tasks, 'c2', true, 2)
    tasks = answerTask(tasks, 'w1', false, 3)
    tasks = answerTask(tasks, 'w2', false, 4)
    tasks = answerTask(tasks, 'w3', false, 5)

    const order: string[] = []
    let lastId: string | null = 'w3'
    for (let i = 0; i < 3; i++) {
      const next = nextTask(tasks, lastId)
      if (!next) throw new Error('expected a task')
      order.push(next.id)
      tasks = answerTask(tasks, next.id, !next.isTrue, 10 + i)
      lastId = next.id
    }
    expect(order).toEqual(['w1', 'w2', 'w3'])
  })

  it('does not repeat the last task directly unless it is the only one', () => {
    const tasks = [
      makeTask('a', { lastAnsweredAt: 5 }),
      makeTask('b', { done: true, lastAnsweredAt: 1 }),
    ]
    expect(nextTask(tasks, 'a')?.id).toBe('b')
    expect(nextTask([tasks[0]], 'a')?.id).toBe('a')
  })
})

describe('removeTask and restoreTask', () => {
  it('restores a removed task at its old position', () => {
    const tasks = [makeTask('a'), makeTask('b'), makeTask('c')]
    const { tasks: rest, removed } = removeTask(tasks, 'b')
    expect(rest.map((t) => t.id)).toEqual(['a', 'c'])
    expect(removed).toEqual({ task: tasks[1], index: 1 })
    expect(restoreTask(rest, tasks[1], 1).map((t) => t.id)).toEqual(['a', 'b', 'c'])
  })
})

describe('createSeedTasks', () => {
  it('creates exactly 20 example statements', () => {
    const seeds = createSeedTasks()
    expect(seeds).toHaveLength(20)
    expect(new Set(seeds.map((t) => t.id)).size).toBe(20)
    expect(seeds.some((t) => t.isTrue)).toBe(true)
    expect(seeds.some((t) => !t.isTrue)).toBe(true)
    expect(seeds[0]).toMatchObject({
      title: 'Bei der Inference ändern sich die Gewichte des Modells.',
      isTrue: false,
    })
    expect(seeds[19]).toMatchObject({
      title: 'Das LLM sieht alle vier Memory-Typen gleichzeitig und automatisch.',
      isTrue: false,
    })
  })
})
