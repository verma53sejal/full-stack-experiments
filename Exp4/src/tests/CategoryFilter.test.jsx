import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CategoryFilter from '../components/CategoryFilter'

describe('CategoryFilter', () => { it('sends the selected category', async () => { const change = vi.fn(); render(<CategoryFilter active="All" onChange={change} />); await screen.getByRole('button', { name: 'Focus' }).click(); expect(change).toHaveBeenCalledWith('Focus') }) })
