import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';

/**
 * HomePage — main landing page.
 * Includes: Hero (banners handled by Header), School Dashboard section,
 * latest PPAs, quick-access cards.
 */
export default function HomePage() {
  const [info, setInfo] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [ppas, setPpas] = useState([]);
  const [loadingDash, setLoadingDash] = useState(true);

  useEffect(() => {
    api.get('/school-info').then(r => setInfo(r.data)).catch(() => {});
    api.get('/school-dashboard')
      .then(r => setDashboard(r.data))
      .catch(() => {})
      .finally(() => setLoadingDash(false));
    api.get('/ppas').then(r => setPpas(r.data.slice(0, 3))).catch(() => {});
  }, []);

  const dashStats = dashboard?.stats || {};
  const grades = dashboard?.grades || [];

  const quickLinks = [
    { label: 'About GARMS', path: '/about', icon: '🏫' },
    { label: 'Admissions', path: '/admissions', icon: '📋' },
    { label: 'Programs & Activities', path: '/ppas', icon: '🎓' },
    { label: 'Accomplishments', path: '/accomplishments', icon: '🏆' },
    { label: "Students' Corner", path: '/students-corner', icon: '⭐' },
    { label: 'Contact Us', path: '/contact', icon: '📞' },
  ];

  return (
    <div>
      {/* Welcome strip */}
      <section className="section" style={{ background: 'var(--gray-50)', paddingTop: 48, paddingBottom: 48 }}>
        <div className="container" style={{ textAlign: 'center' }}>
          {info?.logo_url && (
            <img
              src={getImageUrl(info.logo_url)}
              alt="GARMS"
              style={{ width: 96, height: 96, objectFit: 'contain', borderRadius: '50%', marginBottom: 20 }}
              onError={e => e.target.style.display = 'none'}
            />
          )}
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 900, color: 'var(--gray-900)', marginBottom: 12 }}>
            {info?.school_name || 'General Artemio Ricarte Memorial School'}
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--gray-600)', maxWidth: 600, margin: '0 auto 28px' }}>
            {info?.motto || 'Empowering Artemians with Quality, Excellence, Service, and Resilience'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/admissions" className="btn btn-primary btn-lg">Enroll Now</Link>
            <Link to="/about" className="btn btn-outline btn-lg">Learn More</Link>
          </div>
        </div>
      </section>

      {/* School Dashboard */}
      <section className="section">
        <div className="container">
          <span className="section-eyebrow">By the Numbers</span>
          <h2 className="section-title">School Dashboard</h2>
          <p className="section-subtitle">Key statistics and performance indicators for the current school year.</p>

          {loadingDash ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card" style={{ padding: '24px 28px', textAlign: 'center' }}>
                  <div className="skeleton" style={{ width: '60%', height: 40, margin: '0 auto 12px' }} />
                  <div className="skeleton" style={{ width: '80%', height: 14, margin: '0 auto' }} />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Main KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, marginBottom: 28 }}>
                {[
                  { label: 'Total Enrollment', value: dashStats.enrollment_count?.toLocaleString() || '—', icon: '👨‍🎓' },
                  { label: 'Teaching Personnel', value: dashStats.teaching_personnel || '—', icon: '👨‍🏫' },
                  { label: 'Non-Teaching Personnel', value: dashStats.non_teaching_personnel || '—', icon: '🏢' },
                  { label: 'Performance Indicator', value: dashStats.performance_indicator || '—', icon: '📈', small: true },
                ].map(item => (
                  <div key={item.label} className="card" style={{ padding: '24px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{item.icon}</div>
                    <p style={{ fontSize: item.small ? '0.9rem' : '1.8rem', fontWeight: 900, color: 'var(--red-primary)', lineHeight: 1.2, marginBottom: 6 }}>
                      {item.value}
                    </p>
                    <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Grade-level breakdown */}
              {grades.length > 0 && (
                <div className="card" style={{ padding: '24px 28px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-700)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
                    Grade-Level Breakdown
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ background: 'var(--gray-50)' }}>
                          <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--gray-600)', borderBottom: '1px solid var(--gray-200)' }}>Grade Level</th>
                          <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: 'var(--gray-600)', borderBottom: '1px solid var(--gray-200)' }}>Sections</th>
                          <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: 'var(--gray-600)', borderBottom: '1px solid var(--gray-200)' }}>Classrooms</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grades.map(g => (
                          <tr key={g.grade_level} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                            <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--gray-900)' }}>{g.grade_level}</td>
                            <td style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--gray-700)' }}>{g.sections_count}</td>
                            <td style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--gray-700)' }}>{g.classrooms_count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="section" style={{ background: 'var(--gray-50)', paddingTop: 48, paddingBottom: 48 }}>
        <div className="container">
          <span className="section-eyebrow">Navigate</span>
          <h2 className="section-title">Quick Access</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {quickLinks.map(l => (
              <Link key={l.label} to={l.path} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                padding: '24px 16px', background: 'white', borderRadius: 12,
                border: '1px solid var(--gray-200)', textDecoration: 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: '2rem' }}>{l.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--gray-800)', textAlign: 'center', lineHeight: 1.3 }}>{l.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent PPAs */}
      {ppas.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
              <div>
                <span className="section-eyebrow">What's happening</span>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Programs &amp; Activities</h2>
              </div>
              <Link to="/ppas" style={{ color: 'var(--red-primary)', fontWeight: 700, fontSize: '0.88rem' }}>View All →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {ppas.map(p => (
                <div key={p.id} className="card" style={{ overflow: 'hidden' }}>
                  {p.image_url && (
                    <img src={getImageUrl(p.image_url)} alt={p.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                  )}
                  <div style={{ padding: '16px 20px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-900)', margin: 0 }}>{p.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
