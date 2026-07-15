import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/helpers';

export default function AdminCharter() {
  const [form, setForm] = useState({ body_richtext: '' });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/charter').then(r => setForm(r.data || {})).catch(() => {}); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('body_richtext', form.body_richtext || '');
      if (file) fd.append('pdf', file);
      await api.put('/charter', fd);
      toast.success('Saved!');
    } catch { toast.error('Error.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header"><div><h1 className="admin-page-title">📜 Citizen's Charter</h1><p className="admin-page-sub">Edit the Citizen's Charter content (required under RA 11032 / ARTA).</p></div></div>
      <form onSubmit={handleSave}>
        <div className="admin-card">
          <div className="form-group">
            <label className="form-label">Content (HTML supported)</label>
            <textarea className="form-control" rows={16} value={form.body_richtext || ''} onChange={e => setForm(f => ({ ...f, body_richtext: e.target.value }))} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Upload PDF Version (optional)</label>
            {form.pdf_file_url && <p style={{ fontSize: '0.82rem', marginBottom: 8 }}>Current: <a href={getImageUrl(form.pdf_file_url)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red-primary)' }}>📄 View current PDF</a></p>}
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
      </form>
    </div>
  );
}
