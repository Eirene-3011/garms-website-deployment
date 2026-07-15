import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/staff').then(r => r.data.length),
      api.get('/faqs').then(r => r.data.length),
      api.get('/contact/messages').then(r => r.data),
      api.get('/issuances').then(r => r.data.length),
      api.get('/resources').then(r => r.data.length),
      api.get('/ppas').then(r => r.data.length),
    ]).then(([staff, faqs, msgs, issuances, resources, ppas]) => {
      setStats({ staff, faqs, issuances, resources, ppas, unread: msgs.filter(m => !m.is_read).length });
      setMessages(msgs.slice(0, 5));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: '👨‍🏫', label: 'Staff Members', val: stats.staff, path: '/admin/staff', color: 'var(--red-primary)' },
    { icon: '❓', label: 'FAQs', val: stats.faqs, path: '/admin/faqs', color: '#4F46E5' },
    { icon: '📢', label: 'Issuances', val: stats.issuances, path: '/admin/issuances', color: '#0891B2' },
    { icon: '📚', label: 'Resources', val: stats.resources, path: '/admin/resources', color: '#059669' },
    { icon: '🎓', label: 'PPAs', val: stats.ppas, path: '/admin/ppas', color: '#D97706' },
    { icon: '✉️', label: 'Unread Messages', val: stats.unread, path: '/admin/contact', color: stats.unread > 0 ? '#DC2626' : '#6B7280' },
  ];

  const quickActions = [
    { icon: '🖼️', label: 'Manage Banners', path: '/admin/banners' },
    { icon: '📝', label: 'Edit About Us', path: '/admin/content' },
    { icon: '👨‍🏫', label: 'Add Staff', path: '/admin/staff' },
    { icon: '📋', label: 'Upload Issuance', path: '/admin/issuances' },
    { icon: '❓', label: 'Manage FAQs', path: '/admin/faqs' },
    { icon: '📅', label: 'Add Calendar Event', path: '/admin/calendar' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">Welcome to the GARMS Admin Panel. Manage all website content from here.</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">🌐 View Public Site</a>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {cards.map(c => (
          <Link key={c.label} to={c.path} style={{
            display: 'block', background: 'white', borderRadius: 'var(--radius-lg)', padding: '20px 24px',
            border: '1px solid var(--gray-200)', textDecoration: 'none', boxShadow: 'var(--shadow-sm)',
            transition: 'all var(--transition)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{c.label}</p>
                <p style={{ fontSize: '2rem', fontWeight: 900, color: c.color, lineHeight: 1 }}>{loading ? '—' : (c.val ?? 0)}</p>
              </div>
              <span style={{ fontSize: '1.6rem' }}>{c.icon}</span>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Quick Actions */}
        <div className="admin-card">
          <h2 className="admin-card-title">⚡ Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {quickActions.map(a => (
              <Link key={a.label} to={a.path}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)', transition: 'all var(--transition)', border: '1px solid var(--gray-200)' }}>
                <span style={{ fontSize: '1.1rem' }}>{a.icon}</span>
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--gray-100)' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gray-800)', margin: 0 }}>✉️ Recent Messages</h2>
            <Link to="/admin/contact" style={{ fontSize: '0.8rem', color: 'var(--red-primary)', fontWeight: 600 }}>View All</Link>
          </div>
          {loading ? <div className="spinner" style={{ margin: '16px auto' }}></div> : messages.length === 0 ? (
            <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>No messages yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map(m => (
                <div key={m.id} style={{ padding: '10px 12px', background: m.is_read ? 'var(--gray-50)' : 'var(--red-pale)', borderRadius: 'var(--radius-sm)', borderLeft: `3px solid ${m.is_read ? 'var(--gray-200)' : 'var(--red-primary)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gray-900)' }}>{m.sender_name}</p>
                    {!m.is_read && <span className="badge badge-red" style={{ fontSize: '0.65rem' }}>New</span>}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: 2 }}>{m.subject || 'No subject'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin access note */}
      <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', fontSize: '0.82rem', color: 'var(--gray-500)' }}>
        🔒 <strong>Admin Access Link:</strong> <code style={{ background: 'var(--gray-200)', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>http://localhost:5173/admin/login/107960</code> — Keep this link confidential.
      </div>
    </div>
  );
}
