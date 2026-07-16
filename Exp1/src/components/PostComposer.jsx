import { PLATFORMS } from './PlatformDialog';

export default function PostComposer({ content, platform, mediaName, editing, onContentChange, onChoosePlatforms, onMediaChange, onSave, onCancelEdit }) {
  const limit = PLATFORMS.find((item) => item.name === platform)?.limit || 0;
  const remaining = limit - content.length;
  const instagramNeedsImage = platform === 'Instagram' && !mediaName;
  return (
    <section className="composer-card">
      <div className="composer-heading"><div><p className="eyebrow">NEW {editing ? 'DRAFT' : 'POST'}</p><h1>{editing ? 'Edit your draft' : 'Craft your next post'}</h1></div><span className="autosave-note">Stored locally</span></div>
      <div className="platform-row"><div><span className="field-label">PUBLISH TO</span><div className="selected-platforms">{platform ? <span>{platform}</span> : <span className="muted">No platform selected</span>}</div></div><button className="secondary-button choose-button" onClick={onChoosePlatforms}>Choose platform <span>+</span></button></div>
      <label className="field-label" htmlFor="post-content">WRITE YOUR POST</label>
      <textarea id="post-content" value={content} onChange={(event) => onContentChange(event.target.value)} placeholder="Share something worth talking about…" />
      <div className="counter-panel"><div><span>Maximum character limit</span><strong>{limit ? limit.toLocaleString() : '—'}</strong></div><div><span>Characters typed</span><strong>{content.length} / {limit || '—'}</strong></div><p className={remaining < 0 ? 'over-limit' : 'remaining'}>{limit ? (remaining < 0 ? `⚠ Warning: Character limit exceeded by ${Math.abs(remaining)} characters.` : `${remaining} characters remaining`) : 'Choose a platform to set a character limit.'}</p></div>
      <div className="attachment-row"><label className="upload-control"><input type="file" accept="image/*,video/*" onChange={(event) => onMediaChange(event.target.files?.[0]?.name || '')} /><span>↥</span><div><strong>{mediaName || 'Upload image or video'}</strong><small>{mediaName ? 'Attachment ready' : 'PNG, JPG, MP4 and more'}</small></div></label>{instagramNeedsImage && <p className="image-warning">Instagram posts should contain an image.</p>}</div>
      <div className="composer-actions">{editing && <button className="secondary-button" onClick={onCancelEdit}>Cancel edit</button>}<button className="primary-button" onClick={onSave}>{editing ? 'Update draft' : 'Save draft'} <span>→</span></button></div>
    </section>
  );
}
