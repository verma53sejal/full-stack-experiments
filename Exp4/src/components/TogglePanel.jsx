import { Gauge, Link2, Sparkles, Timer } from 'lucide-react'

const controls = [
  ['memo', 'React.memo Optimization', 'Skip untouched cards', Gauge],
  ['callback', 'useCallback Optimization', 'Stabilize drag handlers', Link2],
  ['memoize', 'useMemo Optimization', 'Cache derived views', Sparkles],
  ['clock', 'Live Clock Simulation', 'Pulse every 450ms', Timer],
]

export default function TogglePanel({ settings, onToggle, onReset }) {
  return <section className="control-panel"><div className="section-heading"><div><p className="eyebrow">EXPERIMENT CONTROLS</p><h2>Rendering lab</h2></div><button className="reset-button" onClick={onReset}>Reset render stats</button></div><div className="toggle-grid">{controls.map(([key, title, detail, Icon]) => <label className="toggle-card" key={key}><span className="toggle-icon"><Icon size={18} /></span><span className="toggle-copy"><strong>{title}</strong><small>{detail}</small></span><input type="checkbox" checked={settings[key]} onChange={() => onToggle(key)} /><span className="switch" /></label>)}</div></section>
}
