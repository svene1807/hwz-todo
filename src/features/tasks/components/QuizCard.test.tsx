import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '@/App'
import type { Task } from '@/features/tasks/model'
import { celebrate } from '@/lib/celebrate'
import { CURRENT_VERSION, loadState, saveState } from '@/lib/storage'

vi.mock('@/lib/celebrate', () => ({ celebrate: vi.fn(), originOf: () => ({ x: 0.5, y: 0.5 }) }))

function makeTask(id: string, title: string, isTrue: boolean, createdAt: number): Task {
  return { id, title, isTrue, done: false, lastAnsweredAt: null, createdAt }
}

function quiz() {
  return within(screen.getByRole('region', { name: 'Stimmt das?' }))
}

beforeEach(() => {
  vi.mocked(celebrate).mockClear()
  saveState({
    version: CURRENT_VERSION,
    tasks: [
      makeTask('a', 'Bern ist die Bundesstadt.', true, 1),
      makeTask('b', 'Spinnen sind Insekten.', false, 2),
    ],
  })
})

describe('QuizCard', () => {
  it('shows the first statement', () => {
    render(<App />)
    expect(quiz().getByText('Bern ist die Bundesstadt.')).toBeInTheDocument()
  })

  it('confirms a correct answer, celebrates and saves the progress', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(quiz().getByRole('button', { name: 'Wahr' }))

    expect(quiz().getByRole('status')).toHaveTextContent('Richtig')
    expect(celebrate).toHaveBeenCalledTimes(1)
    expect(loadState().tasks.find((t) => t.id === 'a')).toMatchObject({ done: true })
  })

  it('shows the solution after a wrong answer without confetti', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(quiz().getByRole('button', { name: 'Falsch' }))

    expect(quiz().getByRole('status')).toHaveTextContent('Falsch')
    expect(quiz().getByRole('status')).toHaveTextContent('Diese Aussage ist wahr')
    expect(celebrate).not.toHaveBeenCalled()
  })

  it('works with the keyboard only', async () => {
    const user = userEvent.setup()
    render(<App />)
    const wahr = quiz().getByRole('button', { name: 'Wahr' })
    wahr.focus()
    await user.keyboard('{Enter}')

    const next = quiz().getByRole('button', { name: 'Weiter' })
    expect(next).toHaveFocus()
    await user.keyboard(' ')

    expect(quiz().getByText('Spinnen sind Insekten.')).toBeInTheDocument()
    expect(quiz().getByRole('button', { name: 'Wahr' })).toHaveFocus()
  })
})
