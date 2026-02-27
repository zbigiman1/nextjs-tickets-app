import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// mock next/navigation useRouter
const refreshMock = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: refreshMock }) }))

import { useUpdateStatus } from './useUpdateStatus'

function TestComp() {
  const { loading, error, submit } = useUpdateStatus()
  return (
    <div>
      <button onClick={() => submit('1', 'new')}>submit</button>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="error">{error ?? ''}</div>
    </div>
  )
}

describe('useUpdateStatus', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    refreshMock.mockReset()
  })

  it('refreshes router on successful submit and toggles loading', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true } as unknown as Response)))

    render(<TestComp />)

    const btn = screen.getByText('submit')
    fireEvent.click(btn)

    // wait for refresh to be called
    await waitFor(() => expect(refreshMock).toHaveBeenCalled())

    // loading should eventually be false
    expect(screen.getByTestId('loading').textContent).toBe('false')
    expect(screen.getByTestId('error').textContent).toBe('')
  })

  it('sets error when server returns json error', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => ({ error: 'bad' }) } as unknown as Response)))

    render(<TestComp />)

    const btn = screen.getByText('submit')
    fireEvent.click(btn)

  await waitFor(() => expect(screen.getByTestId('error').textContent).toMatch(/bad/))
  })

  it('sets error when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('net') }))

    render(<TestComp />)

    const btn = screen.getByText('submit')
    fireEvent.click(btn)

  await waitFor(() => expect(screen.getByTestId('error').textContent).toMatch(/net/))
  })
})
