import EventCard from './EventCard'

export default function DayColumn({ day, date, events, onDrop, onSelect, onDragStart, onRender, renderVersion }) {
  return <section className="day-column" onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, day)} data-testid={`day-${day}`}><div className="day-header"><div><h3>{day}</h3><span>{date}</span></div><span className="event-count">{events.length}</span></div><div className="day-events">{events.map((event) => <EventCard key={event.id} event={event} onSelect={onSelect} onDragStart={onDragStart} onRender={onRender} renderVersion={renderVersion} />)}</div></section>
}
