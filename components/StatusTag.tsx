import { Status } from '@/types'

export default function StatusTag({
  status,
  statusLabels
}: {
  status: Status
  statusLabels: Record<string, string>
}) {
  const statusColors: Record<string, string> = {
    new: 'bg-sky-500',
    in_progress: 'bg-orange-500',
    closed: 'bg-green-500'
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full text-white ${statusColors[status]}`}
    >
      {statusLabels[status]}
    </span>
  )
}
