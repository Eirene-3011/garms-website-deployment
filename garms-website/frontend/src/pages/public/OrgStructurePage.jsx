import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';
import { IconLayers } from '../../components/Icons';

const PLACEHOLDER_AVATAR = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="%23e5e7eb"/><circle cx="40" cy="30" r="16" fill="%239ca3af"/><ellipse cx="40" cy="62" rx="24" ry="16" fill="%239ca3af"/></svg>';

const GRADE_LEVELS = ['Kinder', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Non-Teaching'];

export default function OrgStructurePage() {
  const [orgChart, setOrgChart] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/org-chart'),
      api.get('/staff'),
    ]).then(([o, s]) => {
      setOrgChart(o.data);
      setStaff(s.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  // Group staff by department_grade_level
  const grouped = GRADE_LEVELS.reduce((acc, gl) => {
    const members = staff.filter(m => m.department_grade_level === gl);
    if (members.length) acc[gl] = members;
    return acc;
  }, {});

  // Any grade levels not in the predefined list
  const otherKeys = [...new Set(staff.map(m => m.department_grade_level).filter(k => k && !GRADE_LEVELS.includes(k)))];
  otherKeys.forEach(k => { grouped[k] = staff.filter(m => m.department_grade_level === k); });

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › <Link to="/about">About Us</Link> › Organizational Structure</div>
          <div className="page-header-icon"><IconLayers size={26} /></div>
          <h1>Organizational Structure</h1>
          <p>School governance, org chart, and faculty & staff directory</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Org Chart */}
          <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--gray-900)', marginBottom: 20 }}>Org Chart</h2>
          {loading ? (
            <div className="skeleton" style={{ width: '100%', height: 400, borderRadius: 10 }} />
          ) : orgChart?.image_url ? (
            <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 48 }}>
              <img
                src={getImageUrl(orgChart.image_url)}
                alt="GARMS Organizational Chart"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
          ) : (
            <div className="alert alert-info" style={{ marginBottom: 48 }}>
              The organizational chart has not been uploaded yet. Please check back soon.
            </div>
          )}

          {/* Faculty & Staff Directory — directly below org chart */}
          <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--gray-900)', marginBottom: 8 }}>
            Faculty &amp; Staff Directory
          </h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem', marginBottom: 28 }}>
            Teaching and non-teaching personnel of GARMS, grouped by grade level.
          </p>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card" style={{ padding: 16, textAlign: 'center' }}>
                  <div className="skeleton" style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 10px' }} />
                  <div className="skeleton" style={{ width: '70%', height: 12, margin: '0 auto 6px' }} />
                  <div className="skeleton" style={{ width: '50%', height: 10, margin: '0 auto' }} />
                </div>
              ))}
            </div>
          ) : staff.length === 0 ? (
            <div className="alert alert-info">Faculty and staff directory is being updated.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
              {Object.entries(grouped).map(([gradeLevel, members]) => (
                <div key={gradeLevel}>
                  <h3 style={{
                    fontWeight: 700, fontSize: '0.95rem', color: 'var(--red-primary)',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    borderBottom: '2px solid var(--red-pale)', paddingBottom: 8, marginBottom: 16
                  }}>
                    {gradeLevel}
                    <span style={{ fontSize: '0.78rem', fontWeight: 400, color: 'var(--gray-400)', marginLeft: 8, textTransform: 'none' }}>
                      ({members.length} {members.length === 1 ? 'member' : 'members'})
                    </span>
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
                    {members.map(m => (
                      <div key={m.id} style={{
                        background: '#fff', border: '1px solid var(--gray-200)',
                        borderRadius: 10, padding: '16px 12px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        gap: 8, textAlign: 'center',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
                      }}>
                        <img
                          src={m.photo_url ? getImageUrl(m.photo_url) : PLACEHOLDER_AVATAR}
                          alt={m.full_name}
                          style={{ width: 68, height: 68, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gray-200)' }}
                          onError={e => { e.target.src = PLACEHOLDER_AVATAR; }}
                        />
                        <div>
                          <p style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--gray-900)', margin: 0, lineHeight: 1.3 }}>{m.full_name}</p>
                          {m.position_subject && <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)', margin: '3px 0 0' }}>{m.position_subject}</p>}
                          {m.section_name && <p style={{ fontSize: '0.7rem', color: 'var(--gray-400)', margin: '2px 0 0' }}>{m.section_name}</p>}
                        </div>
                      </div>
                    ))}
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
