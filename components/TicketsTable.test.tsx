import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// We will mock next/navigation's useRouter and our useFilterTickets hook
const pushMock = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: pushMock }) }))

const mockUseFilter = vi.fn()
vi.mock('@/lib/useFilterTickets', () => ({ useFilterTickets: (...args: unknown[]) => mockUseFilter(...args) }))

import type { Ticket } from '@/types/Ticket'
import TicketsTable from './TicketsTable'

const labels = { filterByStatus: 'Filter' }
const statusLabels = { all: 'All', new: 'New', in_progress: 'In Progress', closed: 'Closed' }
const columns = { id: 'ID', customer: 'Customer', subject: 'Subject', status: 'Status', priority: 'Priority' }
const priorityLabels = { low: 'Low', medium: 'Medium', high: 'High' }

function makeTicket(id: string, overrides: Partial<Ticket> = {}): Ticket {
  return {
    id,
    customerName: `Cust ${id}`,
    subject: `Subj ${id}`,
    description: '',
    priority: 'low',
    status: 'new',
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('TicketsTable', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    pushMock.mockClear()
    mockUseFilter.mockReset()
  })

  it('shows Loader when loading is true', () => {
    mockUseFilter.mockReturnValue({ tickets: [], loading: true })

    const { container } = render(
      <TicketsTable
        initialTickets={[]}
        labels={labels}
        statusLabels={statusLabels}
        columns={columns}
        priorityLabels={priorityLabels}
      />,
    )

    // Loader renders an element with the spinner class
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeTruthy()
  })

  it('renders tickets and navigates on row click / keyboard', async () => {
    const t1 = makeTicket('t1')
    const t2 = makeTicket('t2', { status: 'in_progress', priority: 'high' })

    mockUseFilter.mockReturnValue({ tickets: [t1, t2], loading: false })

    render(
      <TicketsTable
        initialTickets={[t1, t2]}
        labels={labels}
        statusLabels={statusLabels}
        columns={columns}
        priorityLabels={priorityLabels}
      />,
    )

    // ensure ticket rows render
    expect(screen.getByText('t1')).toBeInTheDocument()
    expect(screen.getByText('Cust t1')).toBeInTheDocument()
    expect(screen.getByText('t2')).toBeInTheDocument()
    expect(screen.getByText('Cust t2')).toBeInTheDocument()

    // click the first row -> should call router.push
    const row = screen.getByText('t1').closest('tr')
    expect(row).toBeTruthy()
    if (row) fireEvent.click(row)
    expect(pushMock).toHaveBeenCalledWith('tickets/t1')

    // keyboard Enter on second row
    const row2 = screen.getByText('t2').closest('tr')
    expect(row2).toBeTruthy()
    if (row2) fireEvent.keyDown(row2, { key: 'Enter', code: 'Enter' })
    expect(pushMock).toHaveBeenCalledWith('tickets/t2')
  })

  it('renders priority label fallback', () => {
    const t = makeTicket('x', { priority: 'custom' as unknown as Ticket['priority'] })
    mockUseFilter.mockReturnValue({ tickets: [t], loading: false })

    render(
      <TicketsTable
        initialTickets={[t]}
        labels={labels}
        statusLabels={statusLabels}
        columns={columns}
        priorityLabels={priorityLabels}
      />,
    )

    // priorityLabels doesn't contain 'custom' so the cell should show 'custom'
    expect(screen.getByText('custom')).toBeInTheDocument()
  })
})
