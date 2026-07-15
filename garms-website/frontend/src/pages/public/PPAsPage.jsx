import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';
import { IconGraduationCap, IconRepeat, IconClock } from '../../components/Icons';

export default function PPAsPage() {
  const [ppas, setPpas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/ppas').then(r => setPpas(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › Programs, Projects & Activities</div>
          <h1>Programs, Projects & Activities</h1>
          <p>GARMS' key programs and school-wide activities that shape our learners</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="ppa-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="card" key={i}>
                  <div className="skeleton" style={{ width: '100%', height: 168, borderRadius: 0 }} />
                  <div className="ppa-body">
                    <div className="skeleton" style={{ width: '70%', height: 14, marginBottom: 10 }} />
                    <div className="skeleton" style={{ width: '100%', height: 10, marginBottom: 6 }} />
                    <div className="skeleton" style={{ width: '85%', height: 10 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : ppas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" aria-hidden="true"><IconClock size={22} /></div>
              <p>Programs & Activities information is coming soon. Please check back later.</p>
            </div>
          ) : (
            <div className="ppa-grid">
              {ppas.map(p => (
                <div key={p.id} className="card">
                  {p.image_url ? (
                    <img
                      src={getImageUrl(p.image_url)}
                      alt={p.name}
                      className="ppa-media"
                    />
                  ) : (
                    <div className="ppa-media-fallback">
                      <div className="ppa-media-fallback-icon" aria-hidden="true">
                        <IconGraduationCap size={26} />
                      </div>
                    </div>
                  )}
                  <div className="ppa-body">
                    <div className="ppa-title-row">
                      <h3 className="ppa-title">{p.name}</h3>
                      {p.frequency && (
                        <span className="badge badge-red ppa-freq-badge">
                          <IconRepeat size={12} />
                          {p.frequency}
                        </span>
                      )}
                    </div>
                    {p.short_description && <p className="ppa-desc">{p.short_description}</p>}
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