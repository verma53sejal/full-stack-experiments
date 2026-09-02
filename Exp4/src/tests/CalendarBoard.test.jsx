import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CalendarBoard from '../components/CalendarBoard'

describe('CalendarBoard', () => { it('renders every day column', () => { render(<CalendarBoard days={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((name) => ({ name, date: '08' }))} events={[]} activeCategory="All" onCategoryChange={() => {}} onDrop={() => {}} onSelect={() => {}} onDragStart={() => {}} />); expect(screen.getAllByTestId(/^day-/)).toHaveLength(7) }) })
