import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { CURRENT_VERSION, saveState } from '@/lib/storage'

vi.mock('@/lib/celebrate', () => ({ celebrate: vi.fn(), originOf: () => ({ x: 0.5, y: 0.5 }) }))

describe('App', () => {
  it('shows the hero title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it.each(['aurora', 'candy', 'neon'])('renders with look %s', (look) => {
    document.documentElement.dataset.look = look
    render(<App />)
    expect(document.documentElement).toHaveAttribute('data-look', look)
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible()
  })
})

describe('Tabs', () => {
  function seed() {
    saveState({
      version: CURRENT_VERSION,
      tasks: [
        {
          id: 'a',
          title: 'Spinnen sind Insekten.',
          isTrue: false,
          done: false,
          lastAnsweredAt: null,
          createdAt: 1,
        },
        {
          id: 'b',
          title: 'Bern ist die Bundesstadt.',
          isTrue: true,
          done: false,
          lastAnsweredAt: null,
          createdAt: 2,
        },
      ],
    })
  }

  it('starts in the quiz tab without the list or the input', () => {
    seed()
    render(<App />)
    expect(screen.getByRole('tab', { name: 'Quiz-Modus' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('region', { name: 'Stimmt das?' })).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Alle Aussagen' })).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: 'Neue Aussage' })).not.toBeInTheDocument()
  })

  it('shows input and list with solutions in the overview tab', async () => {
    const user = userEvent.setup()
    seed()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: 'Fragenübersicht' }))

    expect(screen.getByRole('tab', { name: 'Fragenübersicht' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('textbox', { name: 'Neue Aussage' })).toBeVisible()
    const items = within(screen.getByRole('list', { name: 'Alle Aussagen' })).getAllByRole(
      'listitem',
    )
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Falsch')
    expect(screen.queryByRole('button', { name: 'Alle Aussagen anzeigen' })).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Stimmt das?' })).not.toBeInTheDocument()
  })

  it('switches tabs with the arrow keys', async () => {
    const user = userEvent.setup()
    seed()
    render(<App />)
    screen.getByRole('tab', { name: 'Quiz-Modus' }).focus()
    await user.keyboard('{ArrowRight}')

    const overview = screen.getByRole('tab', { name: 'Fragenübersicht' })
    expect(overview).toHaveFocus()
    expect(overview).toHaveAttribute('aria-selected', 'true')
  })

  it('opens the overview with N and focuses the input', async () => {
    const user = userEvent.setup()
    seed()
    render(<App />)
    await user.keyboard('n')

    expect(screen.getByRole('tab', { name: 'Fragenübersicht' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('textbox', { name: 'Neue Aussage' })).toHaveFocus()
  })

  it('counts a statement added in the overview in the ring', async () => {
    const user = userEvent.setup()
    seed()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: 'Fragenübersicht' }))
    await user.type(screen.getByRole('textbox', { name: 'Neue Aussage' }), 'Neue Aussage{Enter}')
    await user.click(screen.getByRole('tab', { name: 'Quiz-Modus' }))

    expect(screen.getByRole('img', { name: '0 von 3 sitzen' })).toBeInTheDocument()
  })

  it('keeps the answered quiz when switching tabs', async () => {
    const user = userEvent.setup()
    seed()
    render(<App />)
    const quiz = () => within(screen.getByRole('region', { name: 'Stimmt das?' }))
    await user.click(quiz().getByRole('button', { name: 'Falsch' }))
    expect(quiz().getByRole('status')).toHaveTextContent('Richtig')

    await user.click(screen.getByRole('tab', { name: 'Fragenübersicht' }))
    await user.click(screen.getByRole('tab', { name: 'Quiz-Modus' }))

    expect(quiz().getByRole('status')).toHaveTextContent('Richtig')
    expect(screen.getByRole('img', { name: '1 von 2 sitzen' })).toBeInTheDocument()
  })
})
