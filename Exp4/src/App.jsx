import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRenderTracker } from './useRenderTracker';

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const categoryOptions = ['All', 'Meeting', 'Deadline', 'Focus', 'Personal'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const initialEvents = [
  { id: 'monday-design-review', title: 'Design Review', time: '10:00', day: 'Monday', category: 'Meeting' },
  { id: 'monday-ship-v2', title: 'Ship v2.3', time: '16:00', day: 'Monday', category: 'Deadline' },
  { id: 'tuesday-sam', title: '1:1 with Sam', time: '09:30', day: 'Tuesday', category: 'Meeting' },
  { id: 'wednesday-proposal', title: 'Write Proposal', time: '13:00', day: 'Wednesday', category: 'Focus' },
  { id: 'thursday-demo', title: 'Client Demo', time: '15:00', day: 'Thursday', category: 'Meeting' },
  { id: 'thursday-portfolio', title: 'Portfolio Review', time: '18:00', day: 'Thursday', category: 'Focus' },
  { id: 'saturday-grocery', title: 'Grocery Run', time: '10:00', day: 'Saturday', category: 'Personal' },
  { id: 'sunday-sprint', title: 'Sprint Planning', time: '11:00', day: 'Sunday', category: 'Meeting' },
];

const categoryClassMap = {
  Meeting: 'meeting',
  Deadline: 'deadline',
  Focus: 'focus',
  Personal: 'personal',
};

const filterEvents = (events, selectedCategory) => {
  if (selectedCategory === 'All') return events;
  return events.filter((event) => event.category === selectedCategory);
};

const areEventListsEqual = (left, right) => {
  if (!left || !right) return left === right;
  if (left.length !== right.length) return false;
  return left.every((event, index) => event.id === right[index].id && event.day === right[index].day && event.category === right[index].category);
};

const formatClock = (date) =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);

const getCalendarDays = (monthDate) => {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - startOffset);

  const days = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    days.push(date);
  }

  return days;
};

const TogglePanel = ({ optimization, onToggle }) => (
  <div className="toggle-panel">
    {[
      { key: 'reactMemo', label: 'React.memo Optimization' },
      { key: 'useCallback', label: 'useCallback Optimization' },
      { key: 'useMemo', label: 'useMemo Optimization' },
      { key: 'liveClock', label: 'Live Clock Simulation' },
    ].map((item) => (
      <button
        key={item.key}
        type="button"
        className={`toggle-pill ${optimization[item.key] ? 'active' : ''}`}
        onClick={() => onToggle(item.key)}
        aria-pressed={optimization[item.key]}
      >
        <span className="toggle-dot" />
        <span>{item.label}</span>
      </button>
    ))}
  </div>
);

const CategoryFilter = ({ selectedCategory, onSelect }) => (
  <div className="category-filter" aria-label="Category filters">
    {categoryOptions.map((category) => (
      <button
        key={category}
        type="button"
        className={`filter-pill ${selectedCategory === category ? 'selected' : ''}`}
        onClick={() => onSelect(category)}
      >
        {category}
      </button>
    ))}
  </div>
);

function EventCardBase({ event, onCardClick, onDragStart, onDragEnd, isDragging }) {
  return (
    <article
      className={`event-card ${categoryClassMap[event.category] || 'default'} ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={(dragEvent) => {
        dragEvent.dataTransfer.effectAllowed = 'move';
        dragEvent.dataTransfer.setData('text/plain', event.id);
        onDragStart(event.id);
      }}
      onDragEnd={onDragEnd}
      onClick={() => onCardClick(event)}
      aria-label={`${event.title} on ${event.day}`}
    >
      <div className="event-topline">
        <span>{event.time}</span>
        <span className="event-badge">{event.category}</span>
      </div>
      <h4>{event.title}</h4>
    </article>
  );
}

const compareEventCardProps = (prevProps, nextProps) => {
  const prevEvent = prevProps.event;
  const nextEvent = nextProps.event;

  return (
    prevEvent.id === nextEvent.id &&
    prevEvent.day === nextEvent.day &&
    prevEvent.time === nextEvent.time &&
    prevEvent.category === nextEvent.category &&
    prevProps.onDragStart === nextProps.onDragStart &&
    prevProps.isDragging === nextProps.isDragging
  );
};

const EventCard = memo(EventCardBase, compareEventCardProps);

const DayColumn = ({ day, events, onDrop, onDragStart, onDragEnd, onCardClick, reactMemoEnabled, draggingEventId }) => {
  const handleDrop = (event) => {
    event.preventDefault();
    onDrop(day);
  };

  const handleEventDragStart = useCallback((eventId) => {
    onDragStart(eventId);
  }, [onDragStart]);

  const EventCardComponent = reactMemoEnabled ? EventCard : EventCardBase;

  return (
    <div className="day-column" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
      <div className="day-header sticky-header">
        <span>{day}</span>
      </div>
      <div className="day-events">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCardComponent
              key={event.id}
              event={event}
              onCardClick={onCardClick}
              onDragStart={handleEventDragStart}
              onDragEnd={onDragEnd}
              isDragging={draggingEventId === event.id}
            />
          ))
        ) : (
          <div className="empty-day">No events</div>
        )}
      </div>
    </div>
  );
};

const CalendarBoard = ({ events, onCardClick, onDrop, onDragStart, onDragEnd, reactMemoEnabled, draggingEventId }) => (
  <div className="calendar-board" aria-label="Weekly schedule">
    {dayOrder.map((day) => (
      <DayColumn
        key={day}
        day={day}
        events={events.filter((event) => event.day === day)}
        onDrop={onDrop}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onCardClick={onCardClick}
        reactMemoEnabled={reactMemoEnabled}
        draggingEventId={draggingEventId}
      />
    ))}
  </div>
);

const RenderMonitor = ({ stats }) => {
  const renderEntries = Object.entries(stats.eventRenderCounts || {}).sort((a, b) => b[1] - a[1]);
  const maxValue = Math.max(1, ...renderEntries.map(([, value]) => value));

  return (
    <div className="render-monitor card-panel">
      <div className="section-title-row">
        <h3>Render Monitor</h3>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <span>Total Renders</span>
          <strong>{stats.totalRenders}</strong>
        </div>
        <div className="stat-box">
          <span>Cards Rendered</span>
          <strong>{`${stats.cardsRendered}/8`}</strong>
        </div>
        <div className="stat-box">
          <span>Memo Cache Hits</span>
          <strong>{stats.memoCacheHits}</strong>
        </div>
        <div className="stat-box">
          <span>Callback Recreations</span>
          <strong>{stats.callbackRecreations}</strong>
        </div>
      </div>

      <div className="render-list">
        {renderEntries.length > 0 ? (
          renderEntries.map(([eventId, count]) => (
            <div className="render-row" key={eventId}>
              <div className="render-row-label">
                <span>{eventId}</span>
                <strong>{count}</strong>
              </div>
              <div className="progress-bar">
                <span style={{ width: `${(count / maxValue) * 100}%` }} />
              </div>
            </div>
          ))
        ) : (
          <div className="empty-list">No render activity yet.</div>
        )}
      </div>
    </div>
  );
};

const MonthlyCalendar = ({ currentMonth, onMonthChange, today }) => {
  const monthDays = getCalendarDays(currentMonth);

  return (
    <div className="monthly-card card-panel">
      <div className="month-header">
        <button type="button" onClick={() => onMonthChange(-1)} aria-label="Previous month">
          ‹
        </button>
        <h3>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
        <button type="button" onClick={() => onMonthChange(1)} aria-label="Next month">
          ›
        </button>
      </div>

      <div className="mini-weekdays">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="mini-grid">
        {monthDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

          return (
            <span
              key={`${date.toISOString()}-${index}`}
              className={`mini-day ${isCurrentMonth ? '' : 'muted'} ${isToday ? 'today' : ''}`}
            >
              {date.getDate()}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={(clickEvent) => clickEvent.stopPropagation()}>
        <button type="button" className="close-modal" onClick={onClose} aria-label="Close event details">
          ×
        </button>
        <div className="modal-badge">{event.category}</div>
        <h2>{event.title}</h2>
        <div className="modal-meta">
          <span>Time: {event.time}</span>
          <span>Day: {event.day}</span>
          <span>Category: {event.category}</span>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [draggedEventId, setDraggedEventId] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 8, 1));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [optimization, setOptimization] = useState({
    reactMemo: false,
    useCallback: false,
    useMemo: false,
    liveClock: true,
  });

  const { stats, applyRenderDelta, addMemoCacheHit, addCallbackRecreation, resetStats } = useRenderTracker();
  const previousVisibleEventsRef = useRef(filterEvents(initialEvents, 'All'));
  const useCallbackEnabledRef = useRef(false);

  const handleToggle = (key) => {
    setOptimization((previousState) => {
      const nextState = { ...previousState, [key]: !previousState[key] };

      if (key === 'useCallback' && nextState.useCallback && !useCallbackEnabledRef.current) {
        addCallbackRecreation();
        useCallbackEnabledRef.current = true;
      }

      if (key === 'useCallback' && !nextState.useCallback) {
        useCallbackEnabledRef.current = false;
      }

      return nextState;
    });
  };

  const handleOpenEvent = useCallback((event) => {
    if (draggedEventId) return;
    setSelectedEvent(event);
  }, [draggedEventId]);

  const handleCloseEvent = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const handleResetStats = useCallback(() => {
    resetStats();
    setSelectedEvent(null);
    previousVisibleEventsRef.current = filterEvents(events, selectedCategory);
    useCallbackEnabledRef.current = optimization.useCallback;
  }, [events, optimization.useCallback, resetStats, selectedCategory]);

  const handleFilterSelect = useCallback((category) => {
    const nextVisibleEvents = filterEvents(events, category);

    if (optimization.useMemo && areEventListsEqual(previousVisibleEventsRef.current, nextVisibleEvents)) {
      addMemoCacheHit();
    }

    if (optimization.useMemo) {
      previousVisibleEventsRef.current = nextVisibleEvents;
    }

    setSelectedCategory(category);
    applyRenderDelta('filter', optimization.reactMemo, filterEvents(events, category).map((event) => event.id));
  }, [addMemoCacheHit, applyRenderDelta, events, optimization.reactMemo, optimization.useMemo]);

  const handleDragStart = useCallback((eventId) => {
    setDraggedEventId(eventId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedEventId(null);
  }, []);

  const handleDropOnDay = useCallback((day) => {
    if (!draggedEventId) return;

    const sourceEvent = events.find((entry) => entry.id === draggedEventId);
    if (!sourceEvent) {
      setDraggedEventId(null);
      return;
    }

    if (sourceEvent.day === day) {
      setDraggedEventId(null);
      return;
    }

    const nextEvents = events.map((entry) => (entry.id === draggedEventId ? { ...entry, day } : entry));
    const nextVisibleEvents = filterEvents(nextEvents, selectedCategory);

    if (optimization.useMemo && areEventListsEqual(previousVisibleEventsRef.current, nextVisibleEvents)) {
      addMemoCacheHit();
    }

    if (optimization.useMemo) {
      previousVisibleEventsRef.current = nextVisibleEvents;
    }

    setEvents(nextEvents);
    setDraggedEventId(null);

    const renderedEventIds = optimization.reactMemo
      ? [draggedEventId]
      : nextVisibleEvents.map((event) => event.id);

    applyRenderDelta('drag', optimization.reactMemo, renderedEventIds);
  }, [addMemoCacheHit, applyRenderDelta, draggedEventId, events, optimization.reactMemo, optimization.useMemo, selectedCategory]);

  useEffect(() => {
    if (optimization.liveClock) {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 450);

      return () => clearInterval(timer);
    }
    return undefined;
  }, [optimization.liveClock]);

  const memoizedEvents = useMemo(() => filterEvents(events, selectedCategory), [events, selectedCategory]);
  const visibleEvents = optimization.useMemo ? memoizedEvents : filterEvents(events, selectedCategory);

  useEffect(() => {
    if (selectedEvent && !events.some((event) => event.id === selectedEvent.id)) {
      setSelectedEvent(null);
    }
  }, [events, selectedEvent]);

  return (
    <div className="app-shell">
      <header className="top-header">
        <div className="title-block">
          <div className="eyebrow">Experiment 1.4</div>
          <h1>Interactive Calendar Scheduler</h1>
          <p>Schedule and optimize weekly posts with React rendering insights.</p>
        </div>

        <div className="header-actions">
          <div className="digital-clock" aria-live="polite">
            {formatClock(currentTime)}
          </div>
          <button type="button" className="reset-button" onClick={handleResetStats}>
            Reset Render Stats
          </button>
        </div>
      </header>

      <section className="controls-panel card-panel">
        <TogglePanel optimization={optimization} onToggle={handleToggle} />
      </section>

      <div className="workspace-grid">
        <aside className="left-sidebar">
          <MonthlyCalendar
            currentMonth={currentMonth}
            onMonthChange={(direction) =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1),
              )
            }
            today={new Date()}
          />

          <div className="upcoming-card card-panel">
            <div className="section-title-row">
              <h3>Upcoming Tasks</h3>
            </div>
            <ul className="task-list">
              {visibleEvents.slice(0, 5).map((event) => (
                <li key={event.id}>
                  <span className={`task-dot ${categoryClassMap[event.category] || 'default'}`} />
                  <div>
                    <strong>{event.title}</strong>
                    <small>
                      {event.day} · {event.time}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="main-calendar">
          <div className="calendar-toolbar card-panel">
            <CategoryFilter selectedCategory={selectedCategory} onSelect={handleFilterSelect} />
          </div>

          <CalendarBoard
            events={visibleEvents}
            onCardClick={handleOpenEvent}
            onDrop={handleDropOnDay}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            reactMemoEnabled={optimization.reactMemo}
            draggingEventId={draggedEventId}
          />
        </main>

        <aside className="right-sidebar">
          <RenderMonitor stats={stats} />
        </aside>
      </div>

      <EventModal event={selectedEvent} onClose={handleCloseEvent} />
    </div>
  );
}

export default App;
