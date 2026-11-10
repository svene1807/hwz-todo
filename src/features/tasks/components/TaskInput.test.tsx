import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '@/App'
import { CURRENT_VERSION, saveState } from '@/lib/storage'

function listItems() {
  return within(screen.getByRole('list', { name: 'Alle Aussagen' })).queryAllByRole('listitem')
}

describe('TaskInput', () => {
  it('adds a statement with its solution at the top and keeps the focus', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: 'Neue Aussage' })

    await user.click(screen.getByRole('button', { name: 'Falsch', pressed: false }))
    await user.type(input, 'Spinnen haben sechs Beine{Enter}')
    expect(input).toHaveValue('')
    expect(input).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Alle Aussagen anzeigen' }))
    const first = listItems()[0]
    expect(first).toHaveTextContent('Spinnen haben sechs Beine')
    expect(first).toHaveTextContent('Falsch')
    expect(listItems()).toHaveLength(21)
  })

  it('does not add an empty statement and shakes the form', async () => {
    const user = userEvent.setup()
    saveState({ version: CURRENT_VERSION, tasks: [] })
    render(<App />)
    const input = screen.getByRole('textbox', { name: 'Neue Aussage' })

    await user.type(input, '   {Enter}')

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    expect(input.closest('form')).toHaveClass('animate-shake')
    expect(input).toHaveFocus()
  })

  it('accepts at most 200 characters', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: 'Neue Aussage' })
    await user.type(input, 'x'.repeat(210))
    expect(input).toHaveValue('x'.repeat(200))
  })

  it('focuses the input with N and clears it with Escape', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: 'Neue Aussage' })

    await user.keyboard('n')
    expect(input).toHaveFocus()
    expect(input).toHaveValue('')

    await user.type(input, 'Test{Escape}')
    expect(input).toHaveValue('')
    expect(input).not.toHaveFocus()
  })
})
