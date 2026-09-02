import { useEffect, useState } from 'react'
export default function Clock({ enabled }) { const [now, setNow] = useState(new Date()); useEffect(() => { if (!enabled) return; const id = setInterval(() => setNow(new Date()), 450); return () => clearInterval(id) }, [enabled]); return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
