import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';

export default function LearningResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/resources').then(r => setResources(r.data)).finally(() => setLoading(false));
  }, []);

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
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {resources.map(r => (
                <div key={r.id} className="card" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-900)', margin: 0 }}>{r.title}</h3>
                  {r.description && <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', margin: 0, lineHeight: 1.5 }}>{r.description}</p>}
                  {r.subject && <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--red-primary)', background: 'var(--red-pale)', borderRadius: 4, padding: '2px 8px', alignSelf: 'flex-start' }}>{r.subject}</span>}
                  {r.file_url && (
                    <a href={getImageUrl(r.file_url)} target="_blank" rel="noopener noreferrer" style={{ marginTop: 'auto', fontSize: '0.8rem', color: 'var(--red-primary)', fontWeight: 700 }}>
                      📥 Download
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
