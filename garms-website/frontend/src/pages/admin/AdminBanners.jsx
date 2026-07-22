import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/helpers';

const OBSERVANCES = [
  { tag: '', label: '(None — General Slideshow Banner)' },
  { tag: 'teachers_month', label: "National Teachers' Month" },
  { tag: 'womens_month', label: "Women's Month" },
  { tag: '18day_campaign', label: '18-Day Campaign (End Violence Against Women and Children)' },
  { tag: 'buwan_ng_wika', label: 'Buwan ng Wika' },
  { tag: 'nutrition_month', label: 'Nutrition Month' },
  { tag: 'mens_month', label: "Men's Month" },
];

const OBSERVANCE_MAP = Object.fromEntries(OBSERVANCES.map(o => [o.tag, o.label]));

const BLANK_FORM = { caption: '', sort_order: 0, observance_tag: '', is_active: 1 };

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(BLANK_FORM);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  const load = () => api.get('/banners/all').then(r => setBanners(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!file && !editId) { toast.error('Please select an image file.'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      if (file) fd.append('image', file);
      fd.append('caption', form.caption);
      fd.append('sort_order', form.sort_order);
      fd.append('is_active', form.is_active);
      fd.append('observance_tag', form.observance_tag || '');
      fd.append('observance_label', form.observance_tag ? OBSERVANCE_MAP[form.observance_tag] : '');
      if (editId) await api.put(`/banners/${editId}`, fd);
      else await api.post('/banners', fd);
      toast.success(editId ? 'Banner updated!' : 'Banner added!');
      setForm(BLANK_FORM); setFile(null); setEditId(null);
      load();
    } catch (err) { toast.error(err.response?.data?.error || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this banner?')) return;
    await api.delete(`/banners/${id}`);
    toast.success('Deleted.'); load();
  };

  const handleEdit = (b) => {
    setEditId(b.id);
    setForm({ caption: b.caption || '', sort_order: b.sort_order || 0, observance_tag: b.observance_tag || '', is_active: b.is_active ?? 1 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleActive = async (b) => {
    const fd = new FormData();
    fd.append('caption', b.caption || '');
    fd.append('sort_order', b.sort_order || 0);
    fd.append('is_active', b.is_active ? 0 : 1);
    fd.append('observance_tag', b.observance_tag || '');
    fd.append('observance_label', b.observance_label || '');
    await api.put(`/banners/${b.id}`, fd);
    load();
  };

  // Group: general banners and observance banners
  const generalBanners = banners.filter(b => !b.observance_tag);
  const observanceBanners = banners.filter(b => !!b.observance_tag);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">🖼️ Homepage Slideshow Banners</h1>
          <p className="admin-page-sub">
            Manage homepage carousel slides. Use the <strong>Observance</strong> field to tag seasonal/observance slides
            (Teachers' Month, Women's Month, etc.) — activate the right one when its season comes.
            These slides only appear on the homepage slideshow and are separate from the site-wide Header Banner.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24 }}>
        {/* Form */}
        <div className="admin-card">
          <h3 className="admin-card-title">{editId ? 'Edit Banner' : 'Add New Banner'}</h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Banner Image {editId ? '(leave blank to keep current)' : '*'}</label>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
            </div>
            <div className="form-group">
              <label className="form-label">Caption</label>
              <textarea className="form-control" rows={3} value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="Banner caption or subtitle..." />
            </div>
            <div className="form-group">
              <label className="form-label">Observance / Season</label>
              <select className="form-control" value={form.observance_tag} onChange={e => setForm(f => ({ ...f, observance_tag: e.target.value }))}>
                {OBSERVANCES.map(o => (
                  <option key={o.tag} value={o.tag}>{o.label}</option>
                ))}
              </select>
              <p style={{ fontSize: '0.76rem', color: 'var(--gray-400)', marginTop: 4 }}>
                Tag this slide to a seasonal observance so you can easily find and activate it each year.
              </p>
            </div>
            <div className="form-group">
              <label className="form-label">Sort Order</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="is_active_chk" checked={!!form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked ? 1 : 0 }))} />
              <label htmlFor="is_active_chk" style={{ fontSize: '0.88rem', color: 'var(--gray-700)', margin: 0 }}>Active (visible in slideshow)</label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Add Banner'}</button>
              {editId && <button type="button" className="btn btn-ghost" onClick={() => { setEditId(null); setForm(BLANK_FORM); }}>Cancel</button>}
            </div>
          </form>
        </div>

        {/* List */}
        <div>
          {/* Observance banners section */}
          <div className="admin-card" style={{ marginBottom: 20 }}>
            <h3 className="admin-card-title">🌟 Observance / Seasonal Banners ({observanceBanners.length})</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: 14 }}>
              Tag observance banners are shown here. Toggle the Active switch when it's their season.
            </p>
            {observanceBanners.length === 0 ? (
              <p style={{ color: 'var(--gray-400)', fontSize: '0.88rem' }}>No observance banners yet. Add one using the form and select an Observance.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {OBSERVANCES.filter(o => o.tag).map(obs => {
                  const slides = observanceBanners.filter(b => b.observance_tag === obs.tag);
                  return (
                    <div key={obs.tag} style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 8, padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: slides.length ? 10 : 0 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gray-800)' }}>
                          {obs.label}
                        </span>
                        {slides.length === 0 && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--gray-400)', fontStyle: 'italic' }}>No slide yet</span>
                        )}
                      </div>
                      {slides.map(b => (
                        <div key={b.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderTop: '1px solid var(--gray-200)' }}>
                          <img src={getImageUrl(b.image_url)} alt="" style={{ width: 80, height: 46, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} onError={e => e.target.style.display='none'} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--gray-700)', margin: 0 }}>{b.caption || '(No caption)'}</p>
                          </div>
                          <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                            <button
                              className={`btn btn-sm ${b.is_active ? 'btn-primary' : 'btn-ghost'}`}
                              style={{ fontSize: '0.72rem', minWidth: 72 }}
                              onClick={() => handleToggleActive(b)}
                            >
                              {b.is_active ? '✅ Active' : '⏸ Inactive'}
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(b)}>✏️</button>
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red-primary)' }} onClick={() => handleDelete(b.id)}>🗑️</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* General banners */}
          <div className="admin-card">
            <h3 className="admin-card-title">General Slideshow Banners ({generalBanners.length})</h3>
            {generalBanners.length === 0 ? (
              <p style={{ color: 'var(--gray-400)', fontSize: '0.88rem' }}>No general banners yet. Add one!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {generalBanners.map(b => (
                  <div key={b.id} style={{ display: 'flex', gap: 14, padding: '10px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', alignItems: 'center' }}>
                    <img src={getImageUrl(b.image_url)} alt="Banner" style={{ width: 120, height: 68, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} onError={e => e.target.style.display='none'} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gray-800)', marginBottom: 4 }}>{b.caption || '(No caption)'}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Order: {b.sort_order} | {b.is_active ? '✅ Active' : '⏸ Inactive'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button
                        className={`btn btn-sm ${b.is_active ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ fontSize: '0.72rem' }}
                        onClick={() => handleToggleActive(b)}
                      >
                        {b.is_active ? '✅' : '⏸'}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(b)}>✏️</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red-primary)' }} onClick={() => handleDelete(b.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
