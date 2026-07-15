import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const BLANK_C = { committee_name: '', description: '', sort_order: 0 };
const BLANK_M = { full_name: '', role: '', contact_no: '' };

export default function AdminCommittees() {
  const [committees, setCommittees] = useState([]);
  const [form, setForm] = useState(BLANK_C);
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [memberForms, setMemberForms] = useState({});

  const load = () => api.get('/committees').then(r => setCommittees(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('file', file);
      if (editId) await api.put(`/committees/${editId}`, fd);
      else await api.post('/committees', fd);
      toast.success('Saved!');
      setForm(BLANK_C); setFile(null); setEditId(null); setShowForm(false); load();
    } catch { toast.error('Error.'); }
    finally { setSaving(false); }
  };

  const handleAddMember = async (committeeId) => {
    const mf = memberForms[committeeId] || BLANK_M;
    if (!mf.full_name) { toast.error('Member name required.'); return; }
    await api.post(`/committees/${committeeId}/members`, mf);
    toast.success('Member added!');
    setMemberForms(f => ({ ...f, [committeeId]: BLANK_M }));
    load();
  };

  const handleDeleteMember = async (id) => { if (!confirm('Remove member?')) return; await api.delete(`/committees/members/${id}`); toast.success('Removed.'); load(); };
  const handleDelete = async (id) => { if (!confirm('Delete committee?')) return; await api.delete(`/committees/${id}`); toast.success('Deleted.'); load(); };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">👥 Committees & Councils</h1></div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(BLANK_C); }}>{showForm ? 'Close' : '+ Add Committee'}</button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <h3 className="admin-card-title">{editId ? 'Edit Committee' : 'Add Committee'}</h3>
          <form onSubmit={handleSave}>
            <div className="form-group"><label className="form-label">Committee Name *</label><input type="text" className="form-control" value={form.committee_name} onChange={e => setForm(f => ({ ...f, committee_name: e.target.value }))} required /></div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Roster File (XLSX/PDF)</label><input type="file" accept=".pdf,.xlsx,.xls,.doc,.docx" onChange={e => setFile(e.target.files[0])} /></div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Add'}</button>
              <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setEditId(null); setForm(BLANK_C); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {committees.map(c => (
        <div key={c.id} className="admin-card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--gray-100)' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)' }}>👥 {c.committee_name}</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => { setEditId(c.id); setForm({ committee_name: c.committee_name, description: c.description || '', sort_order: c.sort_order || 0 }); setShowForm(true); }}>✏️ Edit</button>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red-primary)' }} onClick={() => handleDelete(c.id)}>🗑️ Delete</button>
            </div>
          </div>

          {c.description && <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: 16 }}>{c.description}</p>}

          {/* Members */}
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gray-700)', marginBottom: 10 }}>Members ({c.members?.length || 0})</h4>
          {c.members?.length > 0 && (
            <div className="table-wrapper" style={{ marginBottom: 16 }}>
              <table>
                <thead><tr><th>Name</th><th>Role</th><th>Contact</th><th></th></tr></thead>
                <tbody>
                  {c.members.map(m => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.full_name}</td>
                      <td>{m.role || '—'}</td>
                      <td>{m.contact_no || '—'}</td>
                      <td><button className="btn btn-ghost btn-sm" style={{ color: 'var(--red-primary)' }} onClick={() => handleDeleteMember(m.id)}>🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add member form */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <input type="text" className="form-control" style={{ flex: 1, minWidth: 160 }} placeholder="Member name" value={(memberForms[c.id] || BLANK_M).full_name} onChange={e => setMemberForms(f => ({ ...f, [c.id]: { ...(f[c.id] || BLANK_M), full_name: e.target.value } }))} />
            <input type="text" className="form-control" style={{ flex: 1, minWidth: 140 }} placeholder="Role/Position" value={(memberForms[c.id] || BLANK_M).role} onChange={e => setMemberForms(f => ({ ...f, [c.id]: { ...(f[c.id] || BLANK_M), role: e.target.value } }))} />
            <input type="text" className="form-control" style={{ flex: 1, minWidth: 120 }} placeholder="Contact (optional)" value={(memberForms[c.id] || BLANK_M).contact_no} onChange={e => setMemberForms(f => ({ ...f, [c.id]: { ...(f[c.id] || BLANK_M), contact_no: e.target.value } }))} />
            <button className="btn btn-primary btn-sm" onClick={() => handleAddMember(c.id)}>+ Add Member</button>
          </div>
        </div>
      ))}
    </div>
  );
}
