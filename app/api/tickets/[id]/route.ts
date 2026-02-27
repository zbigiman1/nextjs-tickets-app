import tickets from '@/data/tickets.json'
import type { Ticket } from '@/types'
import { NextResponse } from 'next/server'

// simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const resolvedParams = await params
  const ticket = tickets.find(t => t.id === resolvedParams.id)
  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
  }
  await delay(1000)
  return NextResponse.json(ticket as Ticket)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const resolvedParams = await params
  const id = resolvedParams.id

  let body: Partial<Ticket> | Record<string, unknown>
  try {
    body = (await request.json()) as Partial<Ticket>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Only allow updating a subset of fields
  const allowed = new Set(['subject', 'description', 'status', 'priority', 'customerName'])
  const updates: Partial<Ticket> = {}
  for (const key of Object.keys(body)) {
    if (allowed.has(key)) {
      const val = (body as Record<string, unknown>)[key]
      if (val !== undefined) {
        // narrow types for known updatable fields
        ;(updates as Record<string, unknown>)[key] = val as unknown
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 })
  }

  // Perform a fake in-memory update on the imported tickets array.
  const idx = tickets.findIndex(t => t.id === id)
  if (idx === -1) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
  }

  const updated: Ticket = { ...(tickets[idx] as Ticket), ...(updates as Partial<Ticket>) } as Ticket
  // mutate the in-memory array (non-persistent)
  ;(tickets as Ticket[])[idx] = updated

  await delay(300)
  return NextResponse.json(updated)
}
