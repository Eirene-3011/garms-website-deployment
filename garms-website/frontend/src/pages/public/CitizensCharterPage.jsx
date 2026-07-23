import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';
import { IconScroll, IconDownload, IconScale, IconExternalLink } from '../../components/Icons';

export default function CitizensCharterPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/charter')
      .then(r => setDocuments(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      <div className="page-header" style={{ padding: '60px 0', background: '#fff', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container">
          <div className="page-header-icon" style={{ 
            width: 56, height: 56, background: 'var(--red-pale)', 
            borderRadius: 16, display: 'flex', alignItems: 'center', 
            justifyContent: 'center', marginBottom: 20, color: 'var(--red-primary)' 
          }}>
            <IconScroll size={32} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 12 }}>
            Citizen's Charter
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--gray-500)', maxWidth: 600, lineHeight: 1.6 }}>
            Our commitment to efficient, transparent, and accountable public service, 
            ensuring every citizen receives the quality of care they deserve.
          </p>
        </div>
      </div>

      <section className="section" style={{ padding: '48px 0' }}>
        <div className="container" style={{ maxWidth: 1000 }}>
          <div className="charter-badges" style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
            <span className="charter-badge" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 99, background: 'var(--red-pale)',
              color: 'var(--red-dark)', fontSize: '0.8rem', fontWeight: 700,
              border: '1px solid rgba(var(--red-primary-rgb), 0.1)'
            }}>
              <IconScale size={14} /> RA 11032 — EODB Act of 2018
            </span>
            <span className="charter-badge" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 99, background: 'rgba(59, 130, 246, 0.08)',
              color: '#1e40af', fontSize: '0.8rem', fontWeight: 700,
              border: '1px solid rgba(59, 130, 246, 0.1)'
            }}>
              <IconScale size={14} /> ARTA — Anti-Red Tape Act
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card" style={{ padding: 28, borderRadius: 16, background: '#fff', border: '1px solid var(--gray-100)' }}>
                  <div className="skeleton" style={{ width: '40%', height: 20, marginBottom: 16, borderRadius: 4 }} />
                  <div className="skeleton" style={{ width: '100%', height: 12, marginBottom: 10, borderRadius: 4 }} />
                  <div className="skeleton" style={{ width: '80%', height: 12, borderRadius: 4 }} />
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="alert" style={{ 
              padding: '32px', background: '#fff', borderRadius: 16, 
              border: '1px solid var(--gray-100)', textAlign: 'center',
              color: 'var(--gray-500)'
            }}>
              Citizen's Charter documents are being prepared. Please check back soon or contact the school office.
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 750, color: 'var(--gray-900)' }}>Official Documents</h2>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', fontWeight: 600 }}>
                  {documents.length} OF 16 PUBLISHED
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                {documents.map((doc, i) => (
                  <div 
                    key={doc.id} 
                    className="card-hover-effect"
                    style={{ 
                      padding: 32, display: 'flex', flexDirection: 'column', gap: 16,
                      background: '#fff', borderRadius: 20, border: '1px solid var(--gray-100)',
                      transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'
                    }}
                  >
                    <div style={{ 
                      position: 'absolute', top: 0, right: 0, width: 60, height: 60, 
                      background: 'var(--red-pale)', opacity: 0.4, 
                      clipPath: 'polygon(100% 0, 0 0, 100% 100%)' 
                    }} />
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{
                        width: 36, height: 36, background: 'var(--red-primary)',
                        borderRadius: 10, display: 'flex', alignItems: 'center', 
                        justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem'
                      }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 style={{ fontWeight: 750, fontSize: '1rem', color: 'var(--gray-900)', margin: 0, lineHeight: 1.4 }}>
                        {doc.title}
                      </h3>
                    </div>

                    {doc.description && (
                      <p style={{ fontSize: '0.88rem', color: 'var(--gray-500)', margin: 0, lineHeight: 1.6 }}>
                        {doc.description}
                      </p>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: 12 }}>
                      {doc.pdf_url ? (
                        <a
                          href={getImageUrl(doc.pdf_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-enhanced"
                          style={{ 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            padding: '12px 20px', borderRadius: 12, background: 'var(--gray-900)',
                            color: '#fff', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
                            transition: 'background 0.2s ease'
                          }}
                        >
                          <IconDownload size={16} />
                          View Document
                        </a>
                      ) : (
                        <div style={{ 
                          padding: '12px', borderRadius: 12, background: 'var(--gray-50)',
                          border: '1px dashed var(--gray-200)', textAlign: 'center'
                        }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)', fontWeight: 500 }}>
                            Pending Upload
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ margin: '80px 0 40px', height: 1, background: 'linear-gradient(to right, transparent, var(--gray-200), transparent)' }} />

          <div className="legal-section" style={{ 
            background: '#fff', borderRadius: 24, padding: '40px', 
            border: '1px solid var(--gray-100)', display: 'flex', gap: 32,
            alignItems: 'flex-start'
          }}>
            <div style={{ 
              flexShrink: 0, width: 64, height: 64, background: 'var(--red-pale)', 
              borderRadius: 20, display: 'flex', alignItems: 'center', 
              justifyContent: 'center', color: 'var(--red-primary)' 
            }}>
              <IconScale size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 16 }}>
                Legal Basis & Transparency
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', lineHeight: 1.7, margin: 0 }}>
                  Republic Act No. 11032 (Ease of Doing Business and Efficient Government Service Delivery Act
                  of 2018), Section 6, requires all government agencies, including public schools, to publish
                  their Citizen's Charter on their official website.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', lineHeight: 1.7, margin: 0 }}>
                    This requirement stems from the earlier Anti-Red Tape Act (RA 9485) and is consistent with 
                    Executive Order No. 2, s. 2016 on Freedom of Information.
                  </p>
                  <a
                    href="https://www.deped.gov.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: 'var(--red-primary)', fontWeight: 700, fontSize: '0.9rem',
                      display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none'
                    }}
                  >
                    Official DepEd Portal <IconExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .card-hover-effect:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          border-color: var(--red-pale) !important;
        }
        .btn-enhanced:hover {
          background: var(--red-primary) !important;
        }
        @media (max-width: 768px) {
          .legal-section {
            flex-direction: column;
            padding: 24px;
          }
          .legal-section > div:last-child > div {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}
