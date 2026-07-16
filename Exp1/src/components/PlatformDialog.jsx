const PLATFORMS = [
  { name: 'Twitter (X)', limit: 280, icon: '𝕏' },
  { name: 'Facebook', limit: 63206, icon: 'f' },
  { name: 'Instagram', limit: 2200, icon: '◎' },
  { name: 'LinkedIn', limit: 3000, icon: 'in' },
];

export { PLATFORMS };

export default function PlatformDialog({ open, selected, onClose, onSave }) {
  if (!open) return null;
  const select = (platform) => onSave(platform.name, false);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="platform-modal" role="dialog" aria-modal="true" aria-labelledby="platform-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-heading">
          <div><p className="eyebrow">DISTRIBUTION</p><h2 id="platform-title">Choose platform</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close platform selector">×</button>
        </div>
        <p className="modal-copy">Select the channel you want this post to reach. Its character limit will apply.</p>
        <div className="platform-options">
          {PLATFORMS.map((platform) => (
            <label className={`platform-option ${selected === platform.name ? 'checked' : ''}`} key={platform.name}>
              <input type="radio" name="platform" checked={selected === platform.name} onChange={() => select(platform)} />
              <span className="platform-icon">{platform.icon}</span>
              <span><strong>{platform.name}</strong><small>{platform.limit.toLocaleString()} character limit</small></span>
              <span className="checkmark">✓</span>
            </label>
          ))}
        </div>
        <div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={() => onSave(selected, true)}>Apply selection</button></div>
      </section>
    </div>
  );
}
