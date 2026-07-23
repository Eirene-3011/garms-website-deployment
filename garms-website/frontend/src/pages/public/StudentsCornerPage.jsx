import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';
import Lightbox from '../../components/common/Lightbox';

// Small, quiet line-icons (no emoji) — each encodes what the category means,
// not just decoration.
const Icon = {
  commendation: (props) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M8 1.5l1.85 3.75 4.15.6-3 2.93.71 4.12L8 11l-3.71 1.9.71-4.12-3-2.93 4.15-.6L8 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  featured_student: (props) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.75 14c.6-2.8 2.8-4.5 5.25-4.5s4.65 1.7 5.25 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  accomplishment: (props) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="8" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 9.3L4.6 14.5 8 12.6l3.4 1.9-.9-5.2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
};

const TABS = [
  { key: 'commendation', label: 'Commendations' },
  { key: 'featured_student', label: 'Featured Student' },
  { key: 'accomplishment', label: 'Accomplishments' },
];

export default function StudentsCornerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const activeTab = searchParams.get('tab') || 'commendation';

  useEffect(() => {
    setLoading(true);
    api.get(`/students?type=${activeTab}`)
      .then(r => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const gallery = useMemo(
    () => items
      .filter(i => i.image_url)
      .map(i => ({
        src: getImageUrl(i.image_url),
        title: i.title || i.student_name,
        meta: i.description || undefined,
        id: i.id,
      })),
    [items]
  );

  const openLightbox = (itemId) => {
    const idx = gallery.findIndex(g => g.id === itemId);
    if (idx !== -1) setActiveIndex(idx);
  };

  const activeTabMeta = TABS.find(t => t.key === activeTab);

  return (
    <div>
      <style>{`
        .sc-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--red-dark, #9b2c2c);
          margin-bottom: 10px;
        }
        .sc-eyebrow::before {
          content: '';
          width: 22px; height: 1.5px;
          background: var(--red-dark, #9b2c2c);
        }

        .sc-tabs {
          display: inline-flex;
          gap: 4px;
          padding: 4px;
          background: var(--gray-100, #f3f4f6);
          border: 1px solid var(--gray-200, #e5e7eb);
          border-radius: 12px;
          margin-bottom: 30px;
          overflow-x: auto;
          max-width: 100%;
        }
        .sc-tab {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          white-space: nowrap;
          border: none;
          background: transparent;
          color: var(--gray-600, #4b5563);
          font-size: 0.83rem;
          font-weight: 600;
          padding: 9px 16px;
          border-radius: 9px;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .sc-tab:hover {
          color: var(--gray-900, #111827);
        }
        .sc-tab.active {
          background: var(--white, #fff);
          color: var(--red-dark, #9b2c2c);
          box-shadow: 0 1px 3px rgba(15,15,20,0.12), 0 1px 2px rgba(15,15,20,0.08);
        }
        .sc-tab svg { flex-shrink: 0; }

        .sc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(272px, 1fr));
          gap: 22px;
        }

        .sc-card {
          display: flex;
          flex-direction: column;
          background: var(--white, #fff);
          border: 1px solid var(--gray-200, #e5e7eb);
          border-radius: 14px;
          overflow: hidden;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
        }
        .sc-card:hover {
          border-color: var(--gray-300, #d1d5db);
          box-shadow: 0 18px 40px -18px rgba(15, 15, 20, 0.28);
          transform: translateY(-3px);
        }

        .sc-media {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4 / 3;
          background: var(--gray-100, #f3f4f6);
          cursor: zoom-in;
        }
        .sc-media img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sc-card:hover .sc-media img { transform: scale(1.06); }
        .sc-media-scrim {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%);
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .sc-card:hover .sc-media-scrim { opacity: 1; }

        .sc-expand {
          position: absolute; right: 12px; bottom: 12px;
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          color: var(--gray-900, #111827);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.22s ease, transform 0.22s ease;
        }
        .sc-card:hover .sc-expand { opacity: 1; transform: translateY(0); }

        .sc-body {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }
        .sc-name {
          font-size: 0.94rem;
          font-weight: 700;
          line-height: 1.35;
          color: var(--gray-900, #111827);
          margin: 0;
        }
        .sc-desc {
          font-size: 0.82rem;
          line-height: 1.55;
          color: var(--gray-600, #4b5563);
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sc-empty-icon {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px;
          border-radius: 50%;
          background: var(--red-pale, #fdecec);
          color: var(--red-dark, #9b2c2c);
          margin-bottom: 14px;
        }
      `}</style>

      <div className="page-header">
        <div className="container">
          <span className="sc-eyebrow">Recognition</span>
          <h1>Students' Corner</h1>
          <p>Celebrating the achievements of our Artemians</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="sc-tabs" role="tablist" aria-label="Student recognition categories">
            {TABS.map(t => {
              const TabIcon = Icon[t.key];
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={isActive}
                  className={`sc-tab${isActive ? ' active' : ''}`}
                  onClick={() => setSearchParams({ tab: t.key })}
                >
                  <TabIcon />
                  {t.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="sc-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton" style={{ width: '100%', aspectRatio: '4 / 3' }} />
                  <div className="card-body" style={{ padding: '16px 20px' }}>
                    <div className="skeleton" style={{ width: '70%', height: 16, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: '90%', height: 10 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="alert alert-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="sc-empty-icon">
                {activeTabMeta && <Icon.commendation width={18} height={18} />}
              </span>
              No entries yet for {activeTabMeta?.label.toLowerCase()}. Please check back soon.
            </div>
          ) : (
            <div className="sc-grid">
              {items.map(item => (
                <article key={item.id} className="sc-card">
                  {item.image_url && (
                    <div
                      className="sc-media"
                      onClick={() => openLightbox(item.id)}
                      role="button"
                      tabIndex={0}
                      title="Click to enlarge"
                      aria-label={`Enlarge image: ${item.title || item.student_name}`}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(item.id); } }}
                    >
                      <img
                        src={getImageUrl(item.image_url)}
                        alt={item.title || item.student_name}
                        loading="lazy"
                        onError={e => { e.target.closest('.sc-media').style.display = 'none'; }}
                      />
                      <div className="sc-media-scrim" />
                      <div className="sc-expand" aria-hidden="true">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                          <path d="M5.5 1.5H1.5V5.5M9.5 1.5H13.5V5.5M13.5 9.5V13.5H9.5M5.5 13.5H1.5V9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="sc-body">
                    <h3 className="sc-name">{item.title || item.student_name}</h3>
                    {item.description && <p className="sc-desc">{item.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Lightbox
        items={gallery}
        index={activeIndex}
        onNavigate={setActiveIndex}
        onClose={() => setActiveIndex(null)}
      />
    </div>
  );
}
