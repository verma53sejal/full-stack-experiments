import { useEffect, useState } from 'react';
import PlatformDialog from './components/PlatformDialog';
import PostComposer from './components/PostComposer';
import DraftList from './components/DraftList';
import SuccessPopup from './components/SuccessPopup';

const STORAGE_KEY = 'postly-social-drafts';
const normalizeDraft = (draft) => {
  const { platforms, ...rest } = draft;
  return { ...rest, platform: typeof draft.platform === 'string' ? draft.platform : (Array.isArray(platforms) ? platforms[0] || '' : '') };
};

export default function App() {
  const [drafts, setDrafts] = useState(() => {
    try { return (JSON.parse(localStorage.getItem(STORAGE_KEY)) || []).map(normalizeDraft); } catch { return []; }
  });
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('');
  const [mediaName, setMediaName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts)); }, [drafts]);
  useEffect(() => { if (!toast) return undefined; const timer = setTimeout(() => setToast(''), 3000); return () => clearTimeout(timer); }, [toast]);

  const clearForm = () => { setContent(''); setPlatform(''); setMediaName(''); setEditingId(null); };
  const saveDraft = () => {
    if (!content.trim() && !platform) { setToast('Add post content or select a platform first.'); return; }
    const now = new Date().toISOString();
    const item = { id: editingId || crypto.randomUUID(), content: content.trim(), platform, mediaName, updatedAt: now };
    setDrafts((current) => editingId ? current.map((draft) => draft.id === editingId ? item : draft) : [item, ...current]);
    clearForm(); setToast(editingId ? 'Draft updated successfully' : 'Draft Saved Successfully');
  };
  const editDraft = (draft) => { setContent(draft.content); setPlatform(draft.platform || ''); setMediaName(draft.mediaName || ''); setEditingId(draft.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const deleteDraft = (id) => { if (!window.confirm('Delete this saved draft?')) return; setDrafts((current) => current.filter((draft) => draft.id !== id)); if (editingId === id) clearForm(); setToast('Draft deleted'); };

  return <main className="app-shell"><PostComposer content={content} platform={platform} mediaName={mediaName} editing={Boolean(editingId)} onContentChange={setContent} onChoosePlatforms={() => setDialogOpen(true)} onMediaChange={setMediaName} onSave={saveDraft} onCancelEdit={clearForm} /><DraftList drafts={drafts} onEdit={editDraft} onDelete={deleteDraft} /><PlatformDialog open={dialogOpen} selected={platform} onClose={() => setDialogOpen(false)} onSave={(item, close) => { setPlatform(item); if (close) setDialogOpen(false); }} /><SuccessPopup message={toast} /></main>;
}
