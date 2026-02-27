import tickets from '@/data/tickets.json'
import type { Ticket } from '@/types'
import { NextResponse } from 'next/server'

// simulate delay
const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  let filteredTickets = [...tickets]
  if (status) {
    filteredTickets = filteredTickets.filter(ticket => ticket.status === status)
  }
  await delay(1000)
  return NextResponse.json(filteredTickets as Ticket[])
}