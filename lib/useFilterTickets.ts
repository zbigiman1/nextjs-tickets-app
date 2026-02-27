"use client"

import type { Ticket } from '@/types/Ticket'
import { useEffect, useState } from 'react'

export function useFilterTickets(initialTickets: Ticket[], status: string) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'all') {
      const loadingTimer = setTimeout(() => setLoading(false), 0)
      const restoreTimer = setTimeout(() => setTickets(initialTickets), 0)
      return () => {
        clearTimeout(restoreTimer)
        clearTimeout(loadingTimer)
      }
    }

    let mounted = true
    const timer = setTimeout(() => setLoading(true), 0)

    fetch(`/api/tickets?status=${encodeURIComponent(status)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data: Ticket[]) => {
        if (mounted) setTickets(data)
      })
      .catch(() => {
        if (mounted) setTickets([])
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [status, initialTickets])

  return { tickets, loading }
}
