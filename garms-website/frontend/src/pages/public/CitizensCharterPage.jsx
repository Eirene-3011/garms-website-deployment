import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';
import { IconScroll, IconDownload, IconScale, IconExternalLink } from '../../components/Icons';

export default function CitizensCharterPage() {
  const [charter, setCharter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/charter')
      .then(r => setCharter(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › <Link to="/about">About Us</Link> › Citizen's Charter</div>
          <div className="page-header-icon"><IconScroll size={26} /></div>
          <h1>Citizen's Charter</h1>
          <p>Our commitment to efficient, transparent, and accountable public service</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="charter-badges">
            <span className="charter-badge badge-red">
              <IconScale size={14} /> RA 11032 — EODB Act of 2018
            </span>
            <span className="charter-badge badge-blue">
              <IconScale size={14} /> ARTA — Anti-Red Tape Act
            </span>
          </div>

          {loading ? (
            <div className="card" style={{ padding: '32px 36px' }}>
              <div className="skeleton" style={{ width: '40%', height: 18, marginBottom: 16 }} />
              <div className="skeleton" style={{ width: '100%', height: 12, marginBottom: 10 }} />
              <div className="skeleton" style={{ width: '95%', height: 12, marginBottom: 10 }} />
              <div className="skeleton" style={{ width: '85%', height: 12 }} />
            </div>
          ) : charter?.body_richtext ? (
            <div
              className="rich-content card"
              style={{ padding: '32px 36px' }}
              dangerouslySetInnerHTML={{ __html: charter.body_richtext }}
            />
          ) : (
            <div className="alert alert-info">
              Citizen's Charter content is being prepared. Please check back soon or contact the school office.
            </div>
          )}

          {charter?.pdf_file_url && (
            <div style={{ marginTop: 24 }}>
              <a
                href={getImageUrl(charter.pdf_file_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <IconDownload size={18} />
                Download Citizen's Charter (PDF)
              </a>
            </div>
          )}

          <div className="divider" />

          <div className="note-panel">
            <div className="note-panel-icon"><IconScale size={18} /></div>
            <div>
              <h3 className="note-panel-title">Legal Basis</h3>
              <p>
                Republic Act No. 11032 (Ease of Doing Business and Efficient Government Service Delivery Act
                of 2018), Section 6, requires all government agencies, including public schools, to publish
                their Citizen's Charter on their official website. This requirement stems from the earlier
                Anti-Red Tape Act (RA 9485) and is consistent with Executive Order No. 2, s. 2016 on Freedom
                of Information.
              </p>
              <p>
                For the official DepEd Citizen's Charter, visit{' '}
                <a
                  href="https://www.deped.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--red-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  www.deped.gov.ph <IconExternalLink size={13} />
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}