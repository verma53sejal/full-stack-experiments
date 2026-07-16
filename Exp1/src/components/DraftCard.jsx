export default function DraftCard({ draft, onEdit, onDelete }) {
  return (
    <article className="draft-card">
      <div className="draft-card-top"><span className="draft-label">DRAFT</span><time>{new Date(draft.updatedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</time></div>
      <p className="draft-content">{draft.content || <em>No post text added</em>}</p>
      <div className="draft-meta"><span>⌁ {draft.platform || 'No platform'}</span><span>{draft.content.length} characters</span>{draft.mediaName && <span>▧ {draft.mediaName}</span>}</div>
      <div className="draft-actions"><button onClick={() => onEdit(draft)}>Edit</button><button className="delete-button" onClick={() => onDelete(draft.id)}>Delete</button></div>
    </article>
  );
}
