import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';
import { IconLayers, IconUser, IconBuilding } from '../../components/Icons';

export default function OrgStructurePage() {
  const [chart, setChart] = useState(null);
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/org-chart').catch(() => ({ data: null })),
      api.get('/officials').catch(() => ({ data: [] })),
    ]).then(([c, o]) => {
      setChart(c.data);
      setOfficials(o.data || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › <Link to="/about">About Us</Link> › Organizational Structure</div>
          <div className="page-header-icon"><IconLayers size={26} /></div>
          <h1>Organizational Structure</h1>
          <p>School officials and organizational hierarchy</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="skeleton" style={{ width: '100%', height: 360, marginBottom: 48, borderRadius: 'var(--radius-lg)' }} />
          ) : chart?.image_url ? (
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <img
                src={getImageUrl(chart.image_url)}
                alt="GARMS Organizational Structure"
                style={{
                  maxWidth: '100%',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--gray-200)',
                }}
              />
            </div>
          ) : (
            <div className="alert alert-info">Organizational chart image coming soon.</div>
          )}

          {!loading && officials.length > 0 && (
            <>
              <span className="section-eyebrow">Leadership</span>
              <h2 className="section-title" style={{ marginBottom: 24, display: 'block' }}>School Officials</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
                {officials.map(off => (
                  <div key={off.id} className="card official-card">
                    {off.photo_url ? (
                      <img
                        src={getImageUrl(off.photo_url)}
                        alt={off.full_name}
                        className="avatar-photo"
                      />
                    ) : (
                      <div className="avatar-placeholder" aria-hidden="true">
                        <IconUser size={34} />
                      </div>
                    )}
                    <p className="official-name">{off.full_name}</p>
                    <p className="official-position">{off.position}</p>
                    {off.department_office && <p className="official-office">{off.department_office}</p>}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="note-panel" style={{ marginTop: 32 }}>
            <div className="note-panel-icon"><IconBuilding size={18} /></div>
            <div>
              <h3 className="note-panel-title">Reference</h3>
              <p>
                Per DepEd Order No. 52, s. 2015, this organizational structure reflects the school's official
                hierarchy under the Division of General Trias City, Region IV-A CALABARZON.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}