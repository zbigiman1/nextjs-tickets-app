import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Ticket } from '@/types/Ticket'
import { useFilterTickets } from './useFilterTickets'

function TestComp({ initialTickets, status }: { initialTickets: Ticket[]; status: string }) {
  const { tickets, loading } = useFilterTickets(initialTickets, status)
  if (loading) return <div>LOADING</div>
  return (
    <div>
      {tickets.map(t => (
        <div key={t.id} data-testid={`ticket-${t.id}`}>
          {t.id}
        </div>
      ))}
    </div>
  )
}

describe('useFilterTickets', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('fetches tickets when status is not all', async () => {
    const fetched: Ticket[] = [
      { id: 'f1', customerName: 'X', subject: 'S', description: '', priority: 'low', status: 'new', createdAt: new Date().toISOString() },
    ]

    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => fetched } as unknown as Response)))

  render(<TestComp initialTickets={[{ id: 'a1', customerName: 'A', subject: 's', description: '', priority: 'low', status: 'new', createdAt: new Date().toISOString() }]} status="new" />)

    // wait for fetched ticket to appear
    const el = await screen.findByTestId('ticket-f1')
    expect(el).toBeTruthy()
    expect(el.textContent).toBe('f1')
  })

  it('restores initial tickets when status is all', async () => {
    const fetched: Ticket[] = [
      { id: 'f2', customerName: 'X', subject: 'S', description: '', priority: 'low', status: 'in_progress', createdAt: new Date().toISOString() },
    ]

    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => fetched } as unknown as Response)))

    const { rerender } = render(
      <TestComp initialTickets={[{ id: 'init1', customerName: 'Init', subject: 's', description: '', priority: 'low', status: 'new', createdAt: new Date().toISOString() }]} status="new" />,
    )

    // ensure fetched result loaded
    await screen.findByTestId('ticket-f2')

    // now switch to 'all' and expect initial ticket restored
  rerender(<TestComp initialTickets={[{ id: 'init1', customerName: 'Init', subject: 's', description: '', priority: 'low', status: 'new', createdAt: new Date().toISOString() }]} status="all" />)

    const initEl = await screen.findByTestId('ticket-init1')
    expect(initEl).toBeTruthy()
    expect(initEl.textContent).toBe('init1')
  })
})
