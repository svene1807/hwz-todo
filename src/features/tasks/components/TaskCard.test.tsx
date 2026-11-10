import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import App from '@/App'
import type { Task } from '@/features/tasks/model'
import { CURRENT_VERSION, saveState } from '@/lib/storage'

// jsdom lacks pointer capture, sonner calls it when the toast is clicked
beforeAll(() => {
  Element.prototype.setPointerCapture = vi.fn()
})

function makeTask(id: string, title: string, isTrue: boolean): Task {
  return { id, title, isTrue, done: false, lastAnsweredAt: null, createdAt: 0 }
}

async function openList(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Alle Aussagen anzeigen' }))
}

function listItems() {
  return within(screen.getByRole('list', { name: 'Alle Aussagen' })).getAllByRole('listitem')
}

describe('TaskList and TaskCard', () => {
  it('hides the statements and their solutions until the list is opened', async () => {
    const user = userEvent.setup()
    saveState({ version: CURRENT_VERSION, tasks: [makeTask('a', 'Spinnen sind Insekten.', false)] })
    render(<App />)

    const toggle = screen.getByRole('button', { name: 'Alle Aussagen anzeigen' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('list', { name: 'Alle Aussagen' })).not.toBeInTheDocument()

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveAccessibleName('Alle Aussagen ausblenden')
    expect(listItems()).toHaveLength(1)

    await user.click(toggle)
    expect(screen.queryByRole('list', { name: 'Alle Aussagen' })).not.toBeInTheDocument()
  })

  it('shows the saved statements with their solution', async () => {
    const user = userEvent.setup()
    saveState({
      version: CURRENT_VERSION,
      tasks: [
        makeTask('a', 'Spinnen sind Insekten.', false),
        makeTask('b', 'Bern ist die Bundesstadt.', true),
      ],
    })
    render(<App />)
    await openList(user)
    const items = listItems()
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Spinnen sind Insekten.')
    expect(items[0]).toHaveTextContent('Falsch')
    expect(items[1]).toHaveTextContent('Bern ist die Bundesstadt.')
    expect(items[1]).toHaveTextContent('Wahr')
  })

  it('breaks a long word inside the card', async () => {
    const user = userEvent.setup()
    saveState({ version: CURRENT_VERSION, tasks: [makeTask('a', 'x'.repeat(200), true)] })
    render(<App />)
    await openList(user)
    expect(
      within(screen.getByRole('list', { name: 'Alle Aussagen' })).getByText('x'.repeat(200)),
    ).toHaveClass('break-words')
  })

  it('deletes a statement and restores it at the old position', async () => {
    const user = userEvent.setup()
    saveState({
      version: CURRENT_VERSION,
      tasks: [
        makeTask('a', 'Eins', true),
        makeTask('b', 'Zwei', false),
        makeTask('c', 'Drei', true),
      ],
    })
    render(<App />)
    await openList(user)

    await user.click(screen.getByRole('button', { name: '«Zwei» löschen' }))
    expect(await screen.findByText('Aussage gelöscht')).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: '«Zwei» löschen' })).not.toBeInTheDocument(),
    )

    await user.click(screen.getByRole('button', { name: 'Rückgängig' }))
    const titles = listItems().map((li) => li.textContent)
    expect(titles[1]).toContain('Zwei')
    expect(titles).toHaveLength(3)
  })
})
