export function filterEvents(events, category) {
  if (category === 'All') return events
  return events.filter((event) => event.category === category)
}

export function sortByTime(events) {
  return [...events].sort((a, b) => a.time.localeCompare(b.time))
}
