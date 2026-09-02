import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import RenderMonitor from '../components/RenderMonitor'

describe('RenderMonitor', () => { it('shows render counters', () => { render(<RenderMonitor stats={{ total: 12, cards: 8, hits: 4, callbacks: 2, maxEventRenders: 3 }} events={[]} />); expect(screen.getByText('12')).toBeInTheDocument(); expect(screen.getByText('Memo cache hits')).toBeInTheDocument() }) })
