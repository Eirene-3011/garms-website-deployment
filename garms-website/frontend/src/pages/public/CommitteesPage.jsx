import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';
import { IconUsers, IconDownload } from '../../components/Icons';

export default function CommitteesPage() {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/committees').then(r => setCommittees(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › <Link to="/about">About Us</Link> › Committees</div>
          <div className="page-header-icon"><IconUsers size={26} /></div>
          <h1>Committees & Councils</h1>
          <p>PTA, HPTA, SPTA, SSG/SPG and school governance bodies</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton" style={{ width: '100%', height: 64, borderRadius: 0 }} />
                  <div className="committee-body">
                    <div className="skeleton" style={{ width: '60%', height: 12, marginBottom: 16 }} />
                    <div className="skeleton" style={{ width: '100%', height: 120 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : committees.length === 0 ? (
            <div className="alert alert-info">Committee information is being updated. Please check back soon.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {committees.map(c => (
                <div key={c.id} className="card" style={{ overflow: 'visible' }}>
                  <div className="committee-header">
                    <h3 className="committee-name">
                      <span className="committee-name-icon" aria-hidden="true"><IconUsers size={18} /></span>
                      {c.committee_name}
                    </h3>
                    {c.file_url && (
                      <a
                        href={getImageUrl(c.file_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chip chip-invert"
                      >
                        <IconDownload size={14} />
                        Download
                      </a>
                    )}
                  </div>
                  <div className="committee-body">
                    {c.description && <p className="committee-desc">{c.description}</p>}
                    {c.members?.length > 0 ? (
                      <div className="table-wrapper">
                        <table>
                          <thead>
                            <tr><th>#</th><th>Name</th><th>Role / Position</th><th>Contact</th></tr>
                          </thead>
                          <tbody>
                            {c.members.map((m, i) => (
                              <tr key={m.id}>
                                <td>{i + 1}</td>
                                <td style={{ fontWeight: 600 }}>{m.full_name}</td>
                                <td>{m.role}</td>
                                <td>{m.contact_no || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="empty-note">Member list coming soon.</p>
                    )}
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