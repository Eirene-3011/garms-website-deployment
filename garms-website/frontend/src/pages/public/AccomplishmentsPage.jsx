import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';

export default function AccomplishmentsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/accomplishments').then(r => setItems(r.data)).finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › Accomplishments</div>
          <h1>School Accomplishments</h1>
          <p>Awards, recognitions, and milestones achieved by GARMS</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton" style={{ width: '100%', height: 180 }} />
                  <div className="card-body">
                    <div className="skeleton" style={{ width: '70%', height: 16, marginBottom: 10 }} />
                    <div className="skeleton" style={{ width: '90%', height: 10, marginBottom: 6 }} />
                    <div className="skeleton" style={{ width: '60%', height: 10 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="alert alert-info">No accomplishments posted yet. Check back soon!</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {items.map(item => (
                <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {item.image_url && (
                    <img
                      src={getImageUrl(item.image_url)}
                      alt={item.title}
                      style={{ width: '100%', height: 200, objectFit: 'cover' }}
                      onError={e => e.target.style.display = 'none'}
                    />
                  )}
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 8, padding: '20px 22px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--gray-900)', margin: 0, lineHeight: 1.4 }}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', margin: 0, lineHeight: 1.6 }}>
                        {item.description}
                      </p>
                    )}
                    <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {item.awarding_body && (
                        <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', margin: 0 }}>
                          🏆 {item.awarding_body}
                        </p>
                      )}
                      {item.award_date && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', margin: 0 }}>
                          📅 {formatDate(item.award_date)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
