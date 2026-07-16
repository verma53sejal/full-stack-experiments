import DraftCard from './DraftCard';

export default function DraftList({ drafts, onEdit, onDelete }) {
  return (
    <section className="drafts-section" aria-labelledby="drafts-title">
      <div className="section-heading"><div><p className="eyebrow">YOUR WORKSPACE</p><h2 id="drafts-title">Saved drafts</h2></div><span className="draft-count">{drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'}</span></div>
      {drafts.length ? <div className="draft-grid">{drafts.map((draft) => <DraftCard key={draft.id} draft={draft} onEdit={onEdit} onDelete={onDelete} />)}</div> : <div className="empty-state"><span>✦</span><h3>No drafts yet</h3><p>Your saved social posts will appear here.</p></div>}
    </section>
  );
}
