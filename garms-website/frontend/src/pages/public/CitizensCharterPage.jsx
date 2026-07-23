import React, { useCallback, useEffect, useState } from 'react';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';
import { IconAward, IconCalendar, IconMaximize, IconX } from '../../components/Icons';

export default function AccomplishmentsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.get('/accomplishments')
      .then(response => setItems(response.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!lightbox) return undefined;

    const handleKeyDown = event => {
      if (event.key === 'Escape') setLightbox(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightbox]);

  const openLightbox = useCallback((src, alt) => {
    setLightbox({ src, alt });
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const formatDate = date => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div style={{ background: '#fcfcfc', minHeight: '100vh' }}>
      <div className="page-header" style={{ padding: '48px 0', borderBottom: '1px solid var(--gray-100)', background: '#fff' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 8 }}>
            School Accomplishments
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--gray-500)', maxWidth: 600 }}>
            Awards, recognitions, and milestones achieved by GARMS
          </p>
        </div>
      </div>

      <section className="section" style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 12,
              background: 'var(--red-pale)', color: 'var(--red-dark)',
              fontSize: '0.85rem', fontWeight: 750,
              border: '1px solid rgba(var(--red-primary-rgb), 0.1)'
            }}>
              <IconAward size={16} /> Awards and Recognitions
            </span>
            {!loading && items.length > 0 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)', fontWeight: 600 }}>
                {items.length} TOTAL ENTRIES
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 32 }}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="card" style={{ overflow: 'hidden', borderRadius: 16, border: '1px solid var(--gray-100)' }}>
                  <div className="skeleton" style={{ width: '100%', height: 240 }} />
                  <div className="card-body" style={{ padding: 24 }}>
                    <div className="skeleton" style={{ width: '75%', height: 20, marginBottom: 12 }} />
                    <div className="skeleton" style={{ width: '100%', height: 12, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: '60%', height: 12 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="alert" style={{ 
              padding: '40px', background: '#fff', borderRadius: 16, 
              border: '1px dashed var(--gray-200)', textAlign: 'center',
              color: 'var(--gray-400)'
            }}>
              No accomplishments have been posted yet. Please check back soon.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 32 }}>
              {items.map(item => {
                const imageSrc = item.image_url ? getImageUrl(item.image_url) : null;

                return (
                  <article
                    key={item.id}
                    className="accomplishment-card"
                    style={{ 
                      display: 'flex', flexDirection: 'column', overflow: 'hidden',
                      background: '#fff', borderRadius: 16, border: '1px solid var(--gray-100)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {imageSrc && (
                      <div
                        role="button"
                        tabIndex={0}
                        title="Click to enlarge"
                        aria-label={`Enlarge image: ${item.title}`}
                        onClick={() => openLightbox(imageSrc, item.title)}
                        onKeyDown={event => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            openLightbox(imageSrc, item.title);
                          }
                        }}
                        style={{ position: 'relative', overflow: 'hidden', cursor: 'zoom-in' }}
                      >
                        <img
                          src={imageSrc}
                          alt={item.title}
                          onError={event => { event.currentTarget.parentElement.style.display = 'none'; }}
                          style={{
                            width: '100%', height: 240, objectFit: 'cover', display: 'block',
                            transition: 'transform 0.5s ease',
                          }}
                          className="card-image"
                        />
                        <div style={{
                          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)',
                          opacity: 0, transition: 'opacity 0.3s ease',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff'
                        }} className="image-overlay">
                          <IconMaximize size={24} />
                        </div>
                      </div>
                    )}

                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 12, padding: 28 }}>
                      <h2 style={{
                        margin: 0, color: 'var(--gray-900)',
                        fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.4,
                      }}>
                        {item.title}
                      </h2>
                      
                      {item.description && (
                        <p style={{
                          margin: 0, color: 'var(--gray-600)',
                          fontSize: '0.9rem', lineHeight: 1.6,
                        }}>
                          {item.description}
                        </p>
                      )}

                      <div style={{ 
                        marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--gray-50)',
                        display: 'flex', flexDirection: 'column', gap: 8 
                      }}>
                        {item.awarding_body && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600 }}>
                            <IconAward size={14} style={{ color: 'var(--red-primary)' }} />
                            {item.awarding_body}
                          </div>
                        )}
                        {item.award_date && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: 'var(--gray-400)' }}>
                            <IconCalendar size={14} />
                            {formatDate(item.award_date)}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged image: ${lightbox.alt}`}
          onClick={closeLightbox}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24, background: 'rgba(0, 0, 0, 0.95)',
            cursor: 'zoom-out', animation: 'fadeIn 0.2s ease-out',
            backdropFilter: 'blur(8px)'
          }}
        >
          <button
            type="button"
            aria-label="Close enlarged image"
            onClick={closeLightbox}
            style={{
              position: 'fixed', top: 24, right: 24,
              width: 48, height: 48, border: 'none',
              borderRadius: 12, background: 'rgba(255,255,255,0.1)',
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={event => { event.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
            onMouseOut={event => { event.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          >
            <IconX size={24} />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            onClick={event => event.stopPropagation()}
            style={{
              maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain',
              borderRadius: 12, boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
              cursor: 'default',
            }}
          />
        </div>
      )}

      <style>{`
        .accomplishment-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.04);
          border-color: var(--red-pale) !important;
        }
        .accomplishment-card:hover .card-image {
          transform: scale(1.05);
        }
        .accomplishment-card:hover .image-overlay {
          opacity: 1 !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
