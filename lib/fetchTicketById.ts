import { Ticket } from "@/types"

export async function fetchTicketById(id: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`
  const url = new URL(`/api/tickets/${encodeURIComponent(id)}`, base)
  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch ticket')
  return res.json() as Promise<Ticket>
}