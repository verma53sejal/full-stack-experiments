import { memo, useEffect } from 'react'
import { GripVertical } from 'lucide-react'

function EventCard({ event, onSelect, onDragStart, onRender, renderVersion }) {
  useEffect(() => { onRender?.(event.id) }, [event.id, onRender])
  return <article className={`event-card category-${event.category.toLowerCase()}`} draggable onDragStart={(e) => onDragStart(e, event)} onClick={() => onSelect(event)} data-testid={`event-${event.id}`}><GripVertical className="drag-handle" size={15} /><div className="event-time">{event.time}</div><h3>{event.title}</h3><span className="category-badge">{event.category}</span></article>
}
export default memo(EventCard)
