import TicketsTable from '@/components/TicketsTable'
import { fetchTickets } from '@/lib/fetchTickets'
import { getTranslations } from 'next-intl/server'

export default async function TicketsPage() {
  const t = await getTranslations()
  const tickets = await fetchTickets()

  return (
    <TicketsTable
      initialTickets={tickets}
      labels={{ filterByStatus: t('filterByStatus') }}
      statusLabels={{
        all: t('all'),
        new: t('new'),
        in_progress: t('in_progress'),
        closed: t('closed')
      }}
      columns={{
        id: t('id'),
        customer: t('customerName'),
        subject: t('subject'),
        status: t('status'),
        priority: t('priority')
      }}
      priorityLabels={{ low: t('low'), medium: t('medium'), high: t('high') }}
    />
  )
}
