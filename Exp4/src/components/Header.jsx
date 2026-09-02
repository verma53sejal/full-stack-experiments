import { CalendarDays, CircleHelp } from 'lucide-react'

export default function Header({ clock }) {
  return <header className="topbar">
    <div className="brand-lockup"><div className="brand-mark"><CalendarDays size={22} /></div><div><p className="eyebrow">WEEKLY WORKSPACE</p><h1>Interactive Calendar Scheduler</h1><p className="subtitle">Move your plans around and watch React rendering stay in rhythm.</p></div></div>
    <div className="topbar-meta"><div className="clock"><span className="live-dot" />{clock}</div><button className="icon-button" aria-label="Help"><CircleHelp size={19} /></button></div>
  </header>
}
