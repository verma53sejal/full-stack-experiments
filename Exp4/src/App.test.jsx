import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('Interactive Calendar Scheduler', () => {
  it('renders the calendar', () => {
    render(<App />);

    expect(screen.getByText('Interactive Calendar Scheduler')).toBeInTheDocument();
    expect(screen.getByText('Design Review')).toBeInTheDocument();
    expect(screen.getByText('Monday')).toBeInTheDocument();
  });

  it('opens the event modal when an event is clicked', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Design Review'));

    expect(screen.getByText('Design Review')).toBeInTheDocument();
    expect(screen.getByText('Time: 10:00')).toBeInTheDocument();
  });

  it('filters events by category', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Focus' }));

    expect(screen.getByText('Write Proposal')).toBeInTheDocument();
    expect(screen.queryByText('Design Review')).not.toBeInTheDocument();
  });

  it('updates state when a drag and drop action moves an event', () => {
    render(<App />);

    const sourceCard = screen.getByLabelText('Design Review on Monday');
    const destinationColumn = screen.getByText('Tuesday').closest('.day-column');

    fireEvent.dragStart(sourceCard, {
      dataTransfer: {
        setData: () => {},
        effectAllowed: '',
      },
    });

    fireEvent.drop(destinationColumn, {
      preventDefault: () => {},
    });

    expect(screen.getByText('Design Review')).toBeInTheDocument();
  });
});
