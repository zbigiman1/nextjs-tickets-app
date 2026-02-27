import type { Ticket } from '@/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchTicketById } from './fetchTicketById'

const sample: Ticket = {
  id: '42',
  customerName: 'Bob',
  subject: 'Help',
  description: 'Need help',
  priority: 'medium',
  status: 'in_progress',
  createdAt: new Date().toISOString(),
}

describe('fetchTicketById', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('returns ticket when fetch is ok', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, status: 200, json: async () => sample } as unknown as Response)))
    const res = await fetchTicketById('42')
    expect(res).toEqual(sample)
  })

  it('returns null when 404', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ status: 404 } as unknown as Response)))
    const res = await fetchTicketById('42')
    expect(res).toBeNull()
  })

  it('throws on non-ok non-404', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 500 } as unknown as Response)))
    await expect(fetchTicketById('42')).rejects.toThrow('Failed to fetch ticket')
  })
})
