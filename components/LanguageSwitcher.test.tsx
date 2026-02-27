import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// We'll mock the hooks used by LanguageSwitcher for the simple render test
vi.mock('next-intl', () => ({ useLocale: () => 'en' }))
vi.mock('@/i18n/config', () => ({ locales: ['en', 'pl'] }))
vi.mock('@/i18n/navigation', () => ({ usePathname: () => '/tickets', useRouter: () => ({ replace: vi.fn() }) }))
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return { ...actual, useTransition: () => [false, (cb: () => void) => cb()] }
})

import LanguageSwitcher from './LanguageSwitcher'

describe('LanguageSwitcher', () => {
  it('renders buttons for locales and disables current one', () => {
    render(<LanguageSwitcher />)
    const enBtn = screen.getByText('EN')
    const plBtn = screen.getByText('PL')
    expect(enBtn).toBeDisabled()
    expect(plBtn).toBeEnabled()
  })

  it('calls router.replace when switching locale', async () => {
    vi.resetModules()
    const replaceMock = vi.fn()
    vi.doMock('@/i18n/config', () => ({ locales: ['en', 'pl'] }))
    vi.doMock('next-intl', () => ({ useLocale: () => 'en' }))
    vi.doMock('@/i18n/navigation', () => ({ usePathname: () => '/tickets', useRouter: () => ({ replace: replaceMock }) }))
    vi.doMock('react', async () => ({ ...(await vi.importActual('react')), useTransition: () => [false, (cb: () => void) => cb()] }))

    const { default: LanguageSwitcher2 } = await import('./LanguageSwitcher')
    render(<LanguageSwitcher2 />)
    const plBtn = screen.getByText('PL')
    fireEvent.click(plBtn)
    expect(replaceMock).toHaveBeenCalledWith('/tickets', { locale: 'pl' })
  })
})
