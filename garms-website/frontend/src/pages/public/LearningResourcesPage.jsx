import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';
import { IconBook, IconAbc, IconRuler, IconLibrary, IconFileText, IconDownload } from '../../components/Icons';

const CATS = [
  { key: 'ARAL', label: 'ARAL Program', Icon: IconBook },
  { key: 'KS1', label: 'Key Stage 1', Icon: IconAbc },
  { key: 'KS2', label: 'Key Stage 2', Icon: IconRuler },
  { key: 'Supplementary', label: 'Supplementary', Icon: IconLibrary },
];

export default function LearningResourcesPage() {
  const [resources, setResources] = useState({});
  const [activeTab, setActiveTab] = useState('ARAL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/resources').then(r => {
      const grouped = {};
      CATS.forEach(c => { grouped[c.key] = []; });
      r.data.forEach(res => { if (grouped[res.category]) grouped[res.category].push(res); });
      setResources(grouped);
    }).finally(() => setLoading(false));
  }, []);

  const items = resources[activeTab] || [];
  const activeCat = CATS.find(c => c.key === activeTab);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › Learning Resources</div>
          <h1>Learning Resources</h1>
          <p>ARAL program materials, Key Stage resources, and supplementary learning materials</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }} role="tablist" aria-label="Resource category">
            {CATS.map(c => {
              const count = resources[c.key]?.length;
              const active = activeTab === c.key;
              return (
                <button
                  key={c.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(c.key)}
                  className={`btn ${active ? 'btn-primary' : 'btn-ghost'}`}
                >
                  <c.Icon size={16} />
                  {c.label}
                  {!loading && !!count && <span className="tab-count">{count}</span>}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="resource-row" key={i}>
                  <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)' }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ width: '45%', height: 12, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: '30%', height: 10 }} />
                  </div>
                  <div className="skeleton" style={{ width: 96, height: 32, borderRadius: 'var(--radius-md)' }} />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" aria-hidden="true"><activeCat.Icon size={22} /></div>
              <p>No resources available in this category yet. Please check back soon.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map(r => (
                <div key={r.id} className="resource-row">
                  <div className="resource-icon" aria-hidden="true">
                    <IconFileText size={20} />
                  </div>
                  <div className="resource-info">
                    <p className="resource-title">{r.title}</p>
                    {r.description && <p className="resource-desc">{r.description}</p>}
                  </div>
                  {r.file_url ? (
                    <a href={getImageUrl(r.file_url)} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                      <IconDownload size={14} />
                      Download
                    </a>
                  ) : (
                    <span className="badge badge-gray">Uploading Soon</span>
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
