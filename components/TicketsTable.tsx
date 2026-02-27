'use client'

import { Loader } from '@/components/Loader'
import StatusTag from '@/components/StatusTag'
import { useFilterTickets } from '@/lib/useFilterTickets'
import type { Ticket } from '@/types/Ticket'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function TicketsTable({
  initialTickets,
  labels,
  statusLabels,
  columns,
  priorityLabels
}: {
  initialTickets: Ticket[]
  labels: { filterByStatus: string }
  statusLabels: Record<string, string>
  columns: {
    id: string
    customer: string
    subject: string
    status: string
    priority: string
  }
  priorityLabels: Record<string, string>
}) {
  const router = useRouter()
  const [status, setStatus] = useState<string>('all')
  const { tickets, loading } = useFilterTickets(initialTickets, status)

  if (loading) {
    return <Loader />
  }

  return (
    <div className="space-y-4">
      <header className="flex justify-end">
        <label className="block">
          <span className="text-sm font-medium text-gray-700 mr-2">{labels.filterByStatus}</span>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="hidden md:table-header-group">
            <tr>
              <th className="text-left border-b border-gray-400 px-4 py-3">{columns.id}</th>
              <th className="text-left border-b border-gray-400 px-4 py-3">{columns.customer}</th>
              <th className="text-left border-b border-gray-400 px-4 py-3">{columns.subject}</th>
              <th className="text-left border-b border-gray-400 px-4 py-3">{columns.status}</th>
              <th className="text-left border-b border-gray-400 px-4 py-3">{columns.priority}</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr
                key={ticket.id}
                className="block md:table-row border border-gray-400 md:border-none mb-4 md:mb-0 rounded-lg md:rounded-none shadow md:shadow-none hover:bg-gray-100 cursor-pointer"
                role="link"
                tabIndex={0}
                onClick={() => router.push(`tickets/${ticket.id}`)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    router.push(`tickets/${ticket.id}`)
                  }
                }}
              >
                <td className="block border-b-none md:table-cell px-4 py-3 md:border-b border-gray-200 text-gray-700">
                  {ticket.id}
                </td>
                <td className="block border-b-none md:table-cell px-4 py-3 md:border-b border-gray-200 text-gray-700">
                  {ticket.customerName}
                </td>
                <td className="block border-b-none md:table-cell px-4 py-3 md:border-b border-gray-200 text-gray-700">
                  {ticket.subject}
                </td>
                <td className="block border-b-none md:table-cell px-4 py-3 md:border-b border-gray-200 text-gray-700">
                  <StatusTag status={ticket.status} statusLabels={statusLabels} />
                </td>
                <td className="block border-b-none md:table-cell px-4 py-3 md:border-b border-gray-200 text-gray-700">
                  {priorityLabels?.[ticket.priority] ?? ticket.priority}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
