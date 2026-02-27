import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

describe('Footer', () => {
  it('renders copyright text with current year', async () => {
    vi.resetModules()
    // mock getTranslations to return a translator that maps 'copyright' key
    vi.doMock('next-intl/server', () => ({
      getTranslations: async () => (key: string) => (key === 'copyright' ? 'My Copyright' : key),
    }))

    const { default: Footer } = await import('./Footer')
    const node = await Footer()

  render(node as React.ReactElement)

    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(`My Copyright.*${year}`))).toBeTruthy()
  })
})
