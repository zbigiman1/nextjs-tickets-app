import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

describe('FormatedDate', () => {
  it('renders date in en-US format when locale is en', async () => {
    vi.resetModules()
    vi.doMock('next-intl', () => ({ useLocale: () => 'en' }))
    const { default: FormatedDate } = await import('./FormatedDate')

    const date = '2024-01-02T15:30:00.000Z'
    const expected = new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    render(<FormatedDate date={date} />)
    expect(screen.getByText(expected)).toBeTruthy()
  })

  it('renders date in pl-PL format when locale is pl', async () => {
    vi.resetModules()
    vi.doMock('next-intl', () => ({ useLocale: () => 'pl' }))
    const { default: FormatedDate } = await import('./FormatedDate')

    const date = '2024-12-05T09:05:00.000Z'
    const original = Date.prototype.toLocaleString
    const spy = vi.spyOn(Date.prototype, 'toLocaleString')
    try {
      render(<FormatedDate date={date} />)
      // ensure toLocaleString was called with 'pl-PL' as the locale argument
      expect(spy).toHaveBeenCalled()
      const args = spy.mock.calls[0]
      expect(args[0]).toBe('pl-PL')
    } finally {
      spy.mockRestore()
      Date.prototype.toLocaleString = original
    }
  })
})
