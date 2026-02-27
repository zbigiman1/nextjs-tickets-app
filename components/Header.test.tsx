import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

describe('Header', () => {
  it('renders translated title and LanguageSwitcher', async () => {
    vi.resetModules()
    // mock getTranslations to return translator function
    vi.doMock('next-intl/server', () => ({
      getTranslations: async () => (key: string) => (key === 'title' ? 'My App Title' : key),
    }))

    // mock LanguageSwitcher component
    vi.doMock('@/components/LanguageSwitcher', () => ({
      __esModule: true,
      default: () => <div data-testid="lang-switch">LS</div>,
    }))

    const { default: Header } = await import('./Header')
    const node = await Header()

    render(node as React.ReactElement)

    expect(screen.getByText('My App Title')).toBeTruthy()
    expect(screen.getByTestId('lang-switch')).toBeTruthy()
  })
})
