"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export type UseUpdateStatusResult = {
  loading: boolean
  error: string | null
  submit: (id: string, status: string) => Promise<void>
}

export function useUpdateStatus(): UseUpdateStatusResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function submit(id: string, status: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/tickets/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => null)
        throw new Error(json?.error || 'Failed to update status')
      }
      router.refresh()
    } catch (err: unknown) {
      function extractMessage(e: unknown) {
        if (typeof e === 'string') return e
        if (e && typeof e === 'object' && 'message' in e) {
          const m = (e as { message?: unknown }).message
          if (typeof m === 'string') return m
        }
        return String(e)
      }
      setError(extractMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, submit }
}
