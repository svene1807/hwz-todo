import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '@/App'
import { ProgressRing } from '@/components/ProgressRing'
import type { Task } from '@/features/tasks/model'
import { CURRENT_VERSION, saveState } from '@/lib/storage'

function makeTask(id: string, done: boolean): Task {
  return { id, title: id, isTrue: true, done, lastAnsweredAt: done ? 1 : null, createdAt: 0 }
}

describe('ProgressRing', () => {
  it('shows done of total with a label', () => {
    render(<ProgressRing value={1} total={2} label="1 von 2 sitzen" />)
    expect(screen.getByRole('img', { name: '1 von 2 sitzen' })).toHaveTextContent('1/2')
  })

  it('shows 0/0 without tasks', () => {
    render(<ProgressRing value={0} total={0} label="0 von 0 sitzen" />)
    expect(screen.getByRole('img', { name: '0 von 0 sitzen' })).toHaveTextContent('0/0')
  })

  it('counts the statements that sit in the app header', () => {
    saveState({ version: CURRENT_VERSION, tasks: [makeTask('a', true), makeTask('b', false)] })
    render(<App />)
    expect(screen.getByRole('img', { name: '1 von 2 sitzen' })).toBeInTheDocument()
  })
})

describe('EmptyState', () => {
  it('shows a friendly sentence when there are no statements', () => {
    saveState({ version: CURRENT_VERSION, tasks: [] })
    render(<App />)
    expect(screen.getByText('Keine Aussagen mehr. Zeit für Kaffee.')).toBeInTheDocument()
    expect(screen.getByText('Tippe oben eine neue Aussage ein oder drücke N.')).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Stimmt das?' })).not.toBeInTheDocument()
  })
})
