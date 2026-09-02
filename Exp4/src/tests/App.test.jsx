import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'

describe('calendar dashboard', () => {
  it('renders the weekly scheduler and controls', () => {
    render(<App />)
    expect(screen.getByText('Interactive Calendar Scheduler')).toBeInTheDocument()
    expect(screen.getAllByText('Product stand-up').length).toBeGreaterThan(0)
    expect(screen.getByText('React.memo Optimization')).toBeInTheDocument()
  })

  it('filters events by category', async () => {
    render(<App />)
    await screen.getAllByRole('button', { name: 'Deadline' })[0].click()
    expect(screen.getAllByText('Quarterly report').length).toBeGreaterThan(0)
    expect(screen.queryByTestId('event-standup')).not.toBeInTheDocument()
  })
})
