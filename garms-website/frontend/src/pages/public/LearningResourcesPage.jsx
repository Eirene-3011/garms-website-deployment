import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';
import { IconFileText, IconDownload, IconSearch } from '../../components/Icons';

export default function LearningResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState('All');

  useEffect(() => {
    api.get('/resources').then(r => setResources(r.data)).finally(() => setLoading(false));
  }, []);

  const subjects = useMemo(() => {
    const set = new Set();
    resources.forEach(r => { if (r.subject) set.add(r.subject); });
    return ['All', ...Array.from(set)];
  }, [resources]);

  const filtered = useMemo(() => {
    return resources.filter(r => {
      const matchesSubject = activeSubject === 'All' || r.subject === activeSubject;
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || r.title?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q);
      return matchesSubject && matchesQuery;
    });
  }, [resources, activeSubject, query]);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › Learning Resources</div>
          <h1>Learning Resources</h1>
          <p>Study materials and digital resources for GARMS learners</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Controls: search + subject filter */}
          {!loading && resources.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--gray-50, #f7f7f8)',
                  border: '1px solid var(--gray-200, #e5e5e5)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  flex: '1 1 240px',
                  maxWidth: 320,
                }}
              >
                <IconSearch size={16} style={{ color: 'var(--gray-500, #888)', flexShrink: 0 }} />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search resources..."
                  aria-label="Search resources"
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '0.85rem',
                    width: '100%',
                    color: 'var(--gray-900)',
                  }}
                />
              </div>

              {subjects.length > 1 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {subjects.map(s => {
                    const active = activeSubject === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setActiveSubject(s)}
                        className={`btn btn-sm ${active ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ borderRadius: 20 }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card" style={{ padding: '20px 24px' }}>
                  <div className="skeleton" style={{ width: '70%', height: 16, marginBottom: 10 }} />
                  <div className="skeleton" style={{ width: '90%', height: 10, marginBottom: 6 }} />
                  <div className="skeleton" style={{ width: '50%', height: 10 }} />
                </div>
              ))}
            </div>
          ) : resources.length === 0 ? (
            <div className="alert alert-info">No resources have been posted yet. Please check back soon.</div>
          ) : filtered.length === 0 ? (
            <div className="alert alert-info">
              No resources match your search. Try a different keyword or subject.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {filtered.map(r => (
                <div
                  key={r.id}
                  className="card resource-card"
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div
                      aria-hidden="true"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: 'var(--red-pale)',
                        color: 'var(--red-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconFileText size={18} />
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-900)', margin: 0, lineHeight: 1.4 }}>
                      {r.title}
                    </h3>
                  </div>

                  {r.description && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', margin: 0, lineHeight: 1.5 }}>
                      {r.description}
                    </p>
                  )}

                  {r.subject && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: 'var(--red-primary)',
                        background: 'var(--red-pale)',
                        borderRadius: 4,
                        padding: '2px 8px',
                        alignSelf: 'flex-start',
                      }}
                    >
                      {r.subject}
                    </span>
                  )}

                  {r.file_url ? (
                    <a
                      href={getImageUrl(r.file_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginTop: 'auto',
                        fontSize: '0.8rem',
                        color: 'var(--red-primary)',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <IconDownload size={14} />
                      Download
                    </a>
                  ) : (
                    <span
                      style={{
                        marginTop: 'auto',
                        fontSize: '0.75rem',
                        color: 'var(--gray-500, #888)',
                        fontWeight: 600,
                      }}
                    >
                      Uploading Soon
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .resource-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }
      `}</style>
    </div>
  );
}
