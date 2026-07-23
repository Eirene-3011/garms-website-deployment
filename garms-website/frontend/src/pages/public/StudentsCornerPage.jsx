import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';

const TABS = [
  { key: 'commendation', label: '🌟 Commendations' },
  { key: 'featured_student', label: '⭐ Featured Student' },
  { key: 'accomplishment', label: '🏅 Student Accomplishments' },
];

export default function StudentsCornerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeTab = searchParams.get('tab') || 'commendation';

  useEffect(() => {
    setLoading(true);
    api.get(`/students?type=${activeTab}`)
      .then(r => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Students' Corner</h1>
          <p>Celebrating the achievements of our Artemians</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, borderBottom: '2px solid var(--gray-200)', paddingBottom: 0 }}>
            {TABS.map(t => (
              <button key={t.key}
                className={`tab-btn${activeTab === t.key ? ' active' : ''}`}
                onClick={() => setSearchParams({ tab: t.key })}
              >{t.label}</button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton" style={{ width: '100%', height: 200 }} />
                  <div className="card-body" style={{ padding: '16px 20px' }}>
                    <div className="skeleton" style={{ width: '70%', height: 16, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: '90%', height: 10 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="alert alert-info">No entries yet for this category.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {items.map(item => (
                <div key={item.id} className="card" style={{ overflow: 'hidden' }}>
                  {item.image_url && (
                    <img src={getImageUrl(item.image_url)} alt={item.title || item.student_name} style={{ width: '100%', height: 200, objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                  )}
                  <div style={{ padding: '16px 20px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-900)', margin: '0 0 6px' }}>{item.title || item.student_name}</h3>
                    {item.description && <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', margin: 0, lineHeight: 1.5 }}>{item.description}</p>}
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
