import TicketsTable from '@/components/TicketsTable';
import type { Ticket } from '@/types/Ticket';
import { getTranslations } from 'next-intl/server';


async function fetchTickets() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`
  const url = new URL('/api/tickets', base)
  const res = await fetch(url.toString(), {
    // run on server, no caching for demo purposes; change as needed
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch tickets')
  return res.json() as Promise<Ticket[]>
}

export default async function TicketsPage() {
  const t = await getTranslations();
  const tickets = await fetchTickets()

  return (
    <TicketsTable
      initialTickets={tickets}
      labels={{ filterByStatus: t('filterByStatus') }}
      statusLabels={{ all: t('all'), new: t('new'), in_progress: t('in_progress'), closed: t('closed') }}
      columns={{ id: t('id'), customer: t('customerName'), subject: t('subject'), status: t('status'), priority: t('priority') }}
      priorityLabels={{ low: t('low'), medium: t('medium'), high: t('high') }}
    />
  )
}
