import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import EventCard from '../components/EventCard'

describe('EventCard', () => {
  it('renders event details and remains draggable', () => {
    render(<EventCard event={{ id: 'x', time: '09:00', title: 'Test event', category: 'Focus' }} onSelect={() => {}} onDragStart={() => {}} />)
    expect(screen.getByText('Test event')).toBeInTheDocument()
    expect(screen.getByTestId('event-x')).toHaveAttribute('draggable', 'true')
  })
})
