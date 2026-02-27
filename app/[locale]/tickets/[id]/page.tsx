import FormatedDate from '@/components/FormatedDate'
import StatusTag from '@/components/StatusTag'
import UpdateStatus from '@/components/UpdateStatus'
import type { Status, Ticket } from '@/types/Ticket'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function fetchTicketById(id: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`
  const url = new URL(`/api/tickets/${encodeURIComponent(id)}`, base)
  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch ticket')
  return res.json() as Promise<Ticket>
}

export default async function TicketPage({
  params
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const resolvedParams = await params
  const id = resolvedParams.id
  const t = await getTranslations()
  const statusLabels = {
    all: t('all'),
    new: t('new'),
    in_progress: t('in_progress'),
    closed: t('closed')
  }

  const ticket = await fetchTicketById(id)
  if (!ticket) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <nav>
          <Link href="/tickets" className="text-sm text-sky-600 hover:text-sky-800">
            {`<<`} {t('ticketsList')}
          </Link>
        </nav>
      </header>
      <h1 className="text-2xl font-semibold">{ticket.subject}</h1>
      <div className="text-sm text-gray-600">
        {t('id')}: <strong className="text-gray-800">{ticket.id}</strong>
      </div>
      <div className="text-sm text-gray-600">
        {t('customerName')}: <strong className="text-gray-800">{ticket.customerName}</strong>
      </div>
      <div className="text-sm text-gray-600">
        {t('status')}:{' '}
        <strong className="text-gray-800">
          <StatusTag status={ticket.status} statusLabels={statusLabels} />
        </strong>
      </div>
      <div>
        <UpdateStatus id={ticket.id} initial={ticket.status as Status} />
      </div>
      <div className="text-sm text-gray-600">
        {t('priority')}: <strong className="text-gray-800">{t(ticket.priority)}</strong>
      </div>
      <div className="text-sm text-gray-600">
        {t('createdAt')}:{' '}
        <strong className="text-gray-800">
          <FormatedDate date={ticket.createdAt} />
        </strong>
      </div>
      <section className="mt-4">
        <h2 className="text-lg font-medium">{t('description')}</h2>
        <p className="whitespace-pre-wrap mt-2">{ticket.description}</p>
      </section>
    </div>
  )
}
