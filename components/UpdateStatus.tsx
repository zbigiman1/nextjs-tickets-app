'use client'

import { useUpdateStatus } from '@/lib/useUpdateStatus'
import type { Status } from '@/types/Ticket'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type Props = {
  id: string
  initial: Status
}

export default function UpdateStatus({ id, initial }: Props) {
  const [status, setStatus] = useState<Status>(initial)
  const { loading, error, submit } = useUpdateStatus()
  const t = useTranslations()

  const handleSubmit = async () => {
    await submit(id, status as string)
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-700">{t('updateStatus')}</label>
      <select
        value={status}
        onChange={e => setStatus(e.target.value as Status)}
        className="border rounded px-2 py-1"
      >
        {(['new', 'in_progress', 'closed'] as Status[]).map(k => (
          <option key={k} value={k}>
            {t(k)}
          </option>
        ))}
      </select>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-sky-600 text-white px-3 py-1 rounded cursor-pointer disabled:opacity-50 hover:bg-sky-700 disabled:hover:bg-sky-600"
      >
        {loading ? '...' : t('update')}
      </button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  )
}
