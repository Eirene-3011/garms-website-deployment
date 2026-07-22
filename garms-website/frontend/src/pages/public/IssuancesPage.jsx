import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';

const TABS = [
  { key: '', label: 'All' },
  { key: 'deped_order', label: 'DepEd Orders' },
  { key: 'procurement', label: 'Procurement' },
  { key: 'memo', label: 'School Memos' },
];

export default function IssuancesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [issuances, setIssuances] = useState([]);
  const [loading, setLoading] = useState(true);
  const type = searchParams.get('type') || '';

  useEffect(() => {
    setLoading(true);
    const url = type ? `/issuances?type=${type}` : '/issuances';
    api.get(url).then(r => setIssuances(r.data)).finally(() => setLoading(false));
  }, [type]);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › Issuances</div>
          <h1>Issuances</h1>
          <p>DepEd orders, procurement postings, and school memoranda</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
            {TABS.map(t => (
              <button key={t.key} className={`tab-btn${type === t.key ? ' active' : ''}`}
                onClick={() => setSearchParams(t.key ? { type: t.key } : {})}>
                {t.label}
              </button>
            ))}
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="card" style={{ padding: '16px 20px' }}>
                  <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 8 }} />
                  <div className="skeleton" style={{ width: '80%', height: 10 }} />
                </div>
              ))}
            </div>
          ) : issuances.length === 0 ? (
            <div className="alert alert-info">No issuances found for this category.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {issuances.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 14, padding: '16px 20px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: 10, alignItems: 'center' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-900)', margin: '0 0 4px' }}>{item.title}</h3>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                      {item.type && <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--red-primary)', background: 'var(--red-pale)', borderRadius: 4, padding: '2px 8px' }}>{item.type.replace('_', ' ')}</span>}
                      {item.date_issued && <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>📅 {formatDate(item.date_issued)}</span>}
                    </div>
                  </div>
                  {item.file_url && (
                    <a href={getImageUrl(item.file_url)} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>
                      📄 View
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
