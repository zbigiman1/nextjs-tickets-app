import { fetchTickets } from '@/lib/fetchTickets'
import type { Ticket } from '@/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const sample: Ticket[] = [
  {
    id: '1',
    customerName: 'Alice',
    subject: 'Hello',
    description: 'Test ticket',
    priority: 'low',
    status: 'new',
    createdAt: new Date().toISOString(),
  },
]

describe('fetchTickets', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns parsed tickets when fetch is ok', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      return {
        ok: true,
        json: async () => sample,
      } as unknown as Response
    }))

    const res = await fetchTickets()
    expect(res).toEqual(sample)
    expect(fetch).toHaveBeenCalled()
  })

  it('throws when fetch returns not ok', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      return { ok: false } as unknown as Response
    }))

    await expect(fetchTickets()).rejects.toThrow('Failed to fetch tickets')
  })
})
