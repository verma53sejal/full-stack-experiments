import { useCallback, useMemo, useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import Header from './components/Header'
import TogglePanel from './components/TogglePanel'
import CalendarBoard from './components/CalendarBoard'
import Agenda from './components/Agenda'
import EventModal from './components/EventModal'
import RenderMonitor from './components/RenderMonitor'
import Clock from './components/Clock'
import { filterEvents, sortByTime } from './utils/filterEvents'
import './styles/app.css'
import './styles/calendar.css'
import './styles/monitor.css'

const days = [{ name: 'Mon', date: '08' }, { name: 'Tue', date: '09' }, { name: 'Wed', date: '10' }, { name: 'Thu', date: '11' }, { name: 'Fri', date: '12' }, { name: 'Sat', date: '13' }, { name: 'Sun', date: '14' }]
const seedEvents = [
  { id: 'standup', day: 'Mon', time: '09:00', title: 'Product stand-up', category: 'Meeting', description: 'Align on the launch path and unblock the team.' },
  { id: 'deep-work', day: 'Mon', time: '11:30', title: 'Deep work block', category: 'Focus', description: 'Protected time for the new calendar experience.' },
  { id: 'dinner', day: 'Mon', time: '18:30', title: 'Dinner with Maya', category: 'Personal', description: 'A relaxed evening away from the desk.' },
  { id: 'critique', day: 'Tue', time: '10:00', title: 'Design critique', category: 'Meeting', description: 'Review the latest interaction patterns.' },
  { id: 'report', day: 'Wed', time: '13:00', title: 'Quarterly report', category: 'Deadline', description: 'Final review before the report goes out.' },
  { id: 'research', day: 'Thu', time: '09:30', title: 'User research', category: 'Focus', description: 'Synthesize this week\'s customer conversations.' },
  { id: 'demo', day: 'Fri', time: '15:00', title: 'Release demo', category: 'Meeting', description: 'Share the finished workflow with the wider team.' },
]
const initialStats = { total: 1, cards: 7, hits: 0, callbacks: 1, maxEventRenders: 1 }

function App() {
  const [events, setEvents] = useState(seedEvents)
  const [settings, setSettings] = useState({ memo: true, callback: true, memoize: true, clock: true })
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [stats, setStats] = useState(initialStats)
  const [, setEventRenders] = useState(Object.fromEntries(seedEvents.map((event) => [event.id, 1])))
  const filteredEvents = useMemo(() => { if (settings.memoize) console.log('Filtering events...'); return filterEvents(events, activeCategory) }, [events, activeCategory, settings.memoize])
  const agenda = useMemo(() => sortByTime(filteredEvents.filter((event) => event.day === 'Mon')), [filteredEvents])
  const handleToggle = (key) => setSettings((current) => ({ ...current, [key]: !current[key] }))
  const recordRender = useCallback((id) => { setStats((current) => ({ ...current, total: current.total + 1, cards: current.cards + 1, hits: settings.memo ? current.hits + 1 : current.hits, maxEventRenders: current.maxEventRenders + 1 })); setEventRenders((current) => ({ ...current, [id]: (current[id] || 0) + 1 })) }, [settings.memo])
  const handleDragStart = useCallback((dragEvent, event) => { dragEvent.dataTransfer.setData('eventId', event.id); console.log('Drag handler created') }, [])
  const handleDrop = useCallback((dropEvent, day) => { const id = dropEvent.dataTransfer.getData('eventId'); setEvents((current) => current.map((event) => event.id === id ? { ...event, day } : event)) }, [])
  const resetStats = () => { setStats(initialStats); setEventRenders(Object.fromEntries(events.map((event) => [event.id, 0]))) }
  const editEvent = () => { if (selectedEvent) { setEvents((current) => current.map((event) => event.id === selectedEvent.id ? { ...event, title: `${event.title} · Edited` } : event)); setSelectedEvent(null) } }

  return (
    <main className="app-shell"><Header clock={<Clock enabled={settings.clock} />} /><TogglePanel settings={settings} onToggle={handleToggle} onReset={resetStats} /><div className="workspace"><div className="content-column"><div className="week-nav"><button className="icon-button"><ChevronLeft size={18} /></button><span><Calendar size={16} /> Week 37 <b>·</b> September 2025</span><button className="icon-button"><ChevronRight size={18} /></button></div><CalendarBoard days={days} events={settings.memo ? filteredEvents : events} activeCategory={activeCategory} onCategoryChange={setActiveCategory} onDrop={handleDrop} onSelect={setSelectedEvent} onDragStart={handleDragStart} onRender={recordRender} renderVersion={settings.memo ? 0 : stats.total} /><Agenda events={agenda} /></div><RenderMonitor stats={stats} events={events} /></div><EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onEdit={editEvent} /></main>
  )
}

export default App
