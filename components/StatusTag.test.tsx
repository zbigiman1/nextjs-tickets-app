import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import StatusTag from './StatusTag'

describe('StatusTag', () => {
  it('renders label and correct color for new', () => {
    render(<StatusTag status={'new'} statusLabels={{ new: 'New' }} />)
    const el = screen.getByText('New')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('bg-sky-500')
  })

  it('renders label and correct color for in_progress', () => {
    render(<StatusTag status={'in_progress'} statusLabels={{ in_progress: 'In Progress' }} />)
    const el = screen.getByText('In Progress')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('bg-orange-500')
  })

  it('renders label and correct color for closed', () => {
    render(<StatusTag status={'closed'} statusLabels={{ closed: 'Closed' }} />)
    const el = screen.getByText('Closed')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('bg-green-500')
  })
})
