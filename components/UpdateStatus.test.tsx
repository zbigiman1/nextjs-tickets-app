import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the translation hook
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))

const submitMock = vi.fn()
const useUpdateMock = vi.fn()
vi.mock('@/lib/useUpdateStatus', () => ({ useUpdateStatus: () => useUpdateMock() }))

import UpdateStatus from './UpdateStatus'

describe('UpdateStatus', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    submitMock.mockReset()
    useUpdateMock.mockReset()
  })

  it('renders and calls submit with selected status', async () => {
    useUpdateMock.mockReturnValue({ loading: false, error: null, submit: submitMock })

    render(<UpdateStatus id="1" initial={'new'} />)

    // default button shows translation key 'update'
    expect(screen.getByText('update')).toBeInTheDocument()

    // change select to in_progress
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'in_progress' } })

    // click update button
    const btn = screen.getByText('update')
    fireEvent.click(btn)

    expect(submitMock).toHaveBeenCalledTimes(1)
    expect(submitMock).toHaveBeenCalledWith('1', 'in_progress')
  })

  it('disables button and shows loading text when loading', () => {
    useUpdateMock.mockReturnValue({ loading: true, error: null, submit: submitMock })

    render(<UpdateStatus id="2" initial={'closed'} />)

    // when loading, the button shows '...'
    expect(screen.getByText('...')).toBeInTheDocument()
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
  })

  it('shows error message when error present', () => {
    useUpdateMock.mockReturnValue({ loading: false, error: 'boom', submit: submitMock })

    render(<UpdateStatus id="3" initial={'new'} />)

    expect(screen.getByText('boom')).toBeInTheDocument()
  })
})
