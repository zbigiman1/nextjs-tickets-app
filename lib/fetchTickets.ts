import { Ticket } from "@/types"

export async function fetchTickets() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`
  const url = new URL('/api/tickets', base)
  const res = await fetch(url.toString(), {
    // run on server, no caching for demo purposes; change as needed
    cache: 'no-store'
  })
  if (!res.ok) throw new Error('Failed to fetch tickets')
  return res.json() as Promise<Ticket[]>
}