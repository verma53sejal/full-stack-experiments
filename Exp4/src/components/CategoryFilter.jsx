const categories = ['All', 'Meeting', 'Deadline', 'Focus', 'Personal']
export default function CategoryFilter({ active, onChange }) { return <div className="filter-row" aria-label="Category filters">{categories.map((category) => <button className={`filter-chip ${active === category ? 'active' : ''}`} key={category} onClick={() => onChange(category)}>{category}</button>)}</div> }
