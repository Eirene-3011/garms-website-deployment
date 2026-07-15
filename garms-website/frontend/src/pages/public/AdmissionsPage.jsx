import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import {
  IconBuilding,
  IconBook,
  IconCoins,
  IconPhone,
  IconClipboard,
  IconListOrdered,
  IconMonitor,
  IconCheck,
  IconCalendar,
} from '../../components/Icons';

const DEFAULT_REQUIREMENTS = [
  'PSA Birth Certificate (authenticated)',
  'Report Card / Form 138 (for incoming Grade 2–6 or transferees)',
  'Certificate of Good Moral Character (for transferees)',
  'Medical / Dental records (if available)',
  '2x2 ID photo',
];

const DEFAULT_STEPS = [
  'Go to the school registrar to pick up an enrollment form.',
  'Fill out the form completely and attach all required documents.',
  'Submit the accomplished form at the school office during enrollment period.',
  'Wait for confirmation and class section assignment.',
];

export default function AdmissionsPage() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollment')
      .then(r => setInfo(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { Icon: IconBuilding, label: 'School Type', value: 'Public Elementary' },
    { Icon: IconBook, label: 'Grade Levels', value: 'Kindergarten to Grade 6' },
    { Icon: IconCoins, label: 'Tuition Fees', value: 'FREE — Public School', highlight: true },
    { Icon: IconPhone, label: 'Contact', value: info?.contact_number || '(046) 472-5307' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › Admissions</div>
          <h1>Admissions & Enrollment</h1>
          <p>Everything you need to know about enrolling at GARMS</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          {/* Quick facts */}
          <div className="stat-grid">
            {stats.map(s => (
              <div key={s.label} className={`stat-card${s.highlight ? ' stat-card-highlight' : ''}`}>
                <div className="stat-card-icon" aria-hidden="true"><s.Icon size={22} /></div>
                <p className="stat-card-label">{s.label}</p>
                {loading && s.label === 'Contact' ? (
                  <div className="skeleton" style={{ width: '70%', height: 14, margin: '0 auto' }} />
                ) : (
                  <p className="stat-card-value">{s.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Requirements */}
          <div className="card" style={{ padding: 32, marginBottom: 24 }}>
            <h2 className="section-card-title">
              <span className="section-card-title-icon"><IconClipboard size={18} /></span>
              Enrollment Requirements
            </h2>
            {info?.requirements_richtext ? (
              <div className="rich-content" dangerouslySetInnerHTML={{ __html: info.requirements_richtext }} />
            ) : (
              <ul className="checklist">
                {DEFAULT_REQUIREMENTS.map(item => (
                  <li key={item}>
                    <span className="checklist-icon" aria-hidden="true"><IconCheck size={13} /></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Process — a real sequence, so it earns numbered markers */}
          <div className="card" style={{ padding: 32, marginBottom: 24 }}>
            <h2 className="section-card-title">
              <span className="section-card-title-icon"><IconListOrdered size={18} /></span>
              Enrollment Process
            </h2>
            {info?.process_richtext ? (
              <div className="rich-content" dangerouslySetInnerHTML={{ __html: info.process_richtext }} />
            ) : (
              <ol className="step-list">
                {DEFAULT_STEPS.map((step, i) => (
                  <li key={step} className="step-item">
                    <span className="step-number">{i + 1}</span>
                    <span className="step-text">{step}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Schedule */}
          {info?.schedule && (
            <div className="note-panel" style={{ marginBottom: 24 }}>
              <div className="note-panel-icon"><IconCalendar size={18} /></div>
              <div>
                <h3 className="note-panel-title">Enrollment Schedule</h3>
                <p>{info.schedule}</p>
              </div>
            </div>
          )}

          {/* Online portal */}
          {info?.online_enrollment_link && (
            <a
              href={info.online_enrollment_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
              style={{ marginBottom: 24 }}
            >
              <IconMonitor size={18} />
              Online Enrollment Portal
            </a>
          )}

          <div className="divider" />

          <div className="cta-panel">
            <div className="cta-panel-icon" aria-hidden="true"><IconPhone size={20} /></div>
            <p>For questions about enrollment, please contact the school.</p>
            <Link to="/contact" className="btn btn-outline">Contact the School</Link>
          </div>
        </div>
      </section>
    </div>
  );
}