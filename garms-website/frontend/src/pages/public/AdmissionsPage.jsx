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

const CHARTER_INFO = {
  office: 'General Artemio Ricarte Memorial School',
  classification: 'Simple',
  transactionType: 'G2C (Government to Citizen)',
  whoMayAvail: 'Learners / Parents / Guardians',
};

const DEFAULT_ONLINE_ENROLLMENT_LINK = 'https://forms.gle/UQkCZ2HXPTedFmxY7';

const STANDARD_REQUIREMENTS = [
  {
    doc: 'Basic Education Enrollment Form (BEEF) — One (1) scanned copy (digital copy)',
    where: 'Downloadable from DepEd Order No. 17, s. 2025',
  },
  {
    doc: 'Confirmation Slip — One (1) scanned copy (digital copy)',
    where: 'School',
  },
  {
    doc: 'PSA Birth Certificate (formerly NSO) — One (1) original copy and one (1) photocopy',
    where: 'Philippine Statistics Authority / Local Civil Registrar',
  },
];

const ALTERNATIVE_REQUIREMENTS = [
  'National ID — One (1) original copy for verification, and one (1) photocopy',
  'Certificate of Live Birth (Local Civil Registry) — One (1) original copy and one (1) photocopy',
  'PhilHealth ID — One (1) original copy and one (1) photocopy',
  'Marriage Certificate of parents — One (1) original copy for verification, and one (1) photocopy',
  'PWD ID — One (1) original copy for verification, and one (1) photocopy',
  'Barangay certification establishing the child\u2019s identity (name, date of birth, sex, and name of parents)',
  'Affidavit of undertaking to be executed by parents — One (1) original copy and one (1) photocopy',
  'Certificate of Foundling (NSO/PSA-issued, if the learner is determined to be a foundling upon enrollment) — One (1) original copy and one (1) photocopy',
  'Baptismal Certificate — One (1) original copy and one (1) photocopy',
];

const SPECIAL_CASE_REQUIREMENTS = [
  {
    condition: 'Displaced learners due to calamities or conflict',
    doc: 'SF9 or SF10, subject to availability',
    where: 'School',
  },
  {
    condition: 'Persons Deprived of Liberty (PDLs) enrolling in ALS',
    doc: 'If the PSA Birth Certificate or secondary documents are not available: Certificate of PDL\u2019s Identity — One (1) original copy',
    where: 'Bureau of Jail Management and Penology — Office of the Warden',
  },
];

const PROCESS_STEPS = [
  {
    clientStep: 'Submit complete documents through the School\u2019s official platform/email address, along with the filled-out BEEF.',
    actions: [
      {
        action: 'Download and print received documents, and check for completion.',
        note: 'If requirements are incomplete, tag as temporarily enrolled.',
        fee: 'None',
        time: '1 hour',
        responsible: 'Registrar / Teacher-in-Charge / Adviser',
      },
      {
        action: 'Provide client with the status of enrollment.',
        fee: 'None',
        time: '5 minutes',
        responsible: 'Registrar / Teacher-in-Charge / Adviser',
      },
      {
        action: 'Endorse list of enrollees to Records/Registrar of Incoming Kindergarten / Grade 1 / Balik-Aral / Transferees / SNED.',
        fee: 'None',
        time: '5 minutes',
        responsible: 'Registrar / Teacher-in-Charge / Adviser',
      },
    ],
  },
];

const TOTAL_PROCESSING = { fee: 'None', time: '1 hour, 10 minutes' };

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
    { Icon: IconCoins, label: 'Fees to be Paid', value: 'None — Public School', highlight: true },
    { Icon: IconPhone, label: 'Contact', value: info?.contact_number || '(046) 472-5307' },
  ];

  const onlineEnrollmentLink = info?.online_enrollment_link || DEFAULT_ONLINE_ENROLLMENT_LINK;

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

          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div>
                <p className="stat-card-label">Office / Division</p>
                <p className="stat-card-value" style={{ fontSize: 14 }}>{CHARTER_INFO.office}</p>
              </div>
              <div>
                <p className="stat-card-label">Classification</p>
                <p className="stat-card-value" style={{ fontSize: 14 }}>{CHARTER_INFO.classification}</p>
              </div>
              <div>
                <p className="stat-card-label">Type of Transaction</p>
                <p className="stat-card-value" style={{ fontSize: 14 }}>{CHARTER_INFO.transactionType}</p>
              </div>
              <div>
                <p className="stat-card-label">Who May Avail</p>
                <p className="stat-card-value" style={{ fontSize: 14 }}>{CHARTER_INFO.whoMayAvail}</p>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 32, marginBottom: 24 }}>
            <h2 className="section-card-title">
              <span className="section-card-title-icon"><IconClipboard size={18} /></span>
              Enrollment Requirements
            </h2>

            {info?.requirements_richtext ? (
              <div className="rich-content" dangerouslySetInnerHTML={{ __html: info.requirements_richtext }} />
            ) : (
              <div>
                <h3 className="stat-card-label" style={{ marginBottom: 8 }}>Standard Requirements</h3>
                <ul className="checklist" style={{ marginBottom: 20 }}>
                  {STANDARD_REQUIREMENTS.map(item => (
                    <li key={item.doc}>
                      <span className="checklist-icon" aria-hidden="true"><IconCheck size={13} /></span>
                      <span>
                        {item.doc}
                        <br />
                        <span style={{ opacity: 0.7, fontSize: 13 }}>Where to secure: {item.where}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <h3 className="stat-card-label" style={{ marginBottom: 8 }}>
                  If PSA Birth Certificate Is Not Available
                </h3>
                <p style={{ marginBottom: 8, opacity: 0.8, fontSize: 14 }}>
                  Any of the following secondary documents may be provided by the client instead:
                </p>
                <ul className="checklist" style={{ marginBottom: 20 }}>
                  {ALTERNATIVE_REQUIREMENTS.map(item => (
                    <li key={item}>
                      <span className="checklist-icon" aria-hidden="true"><IconCheck size={13} /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="stat-card-label" style={{ marginBottom: 8 }}>Special Cases</h3>
                <ul className="checklist">
                  {SPECIAL_CASE_REQUIREMENTS.map(item => (
                    <li key={item.condition}>
                      <span className="checklist-icon" aria-hidden="true"><IconCheck size={13} /></span>
                      <span>
                        <strong>{item.condition}:</strong> {item.doc}
                        <br />
                        <span style={{ opacity: 0.7, fontSize: 13 }}>Where to secure: {item.where}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="card" style={{ padding: 32, marginBottom: 24 }}>
            <h2 className="section-card-title">
              <span className="section-card-title-icon"><IconListOrdered size={18} /></span>
              Enrollment Process
            </h2>

            {info?.process_richtext ? (
              <div className="rich-content" dangerouslySetInnerHTML={{ __html: info.process_richtext }} />
            ) : (
              <div>
                {PROCESS_STEPS.map((group, i) => (
                  <ol className="step-list" key={i} style={{ marginBottom: 8 }}>
                    <li className="step-item">
                      <span className="step-number">1</span>
                      <span className="step-text"><strong>Client Step:</strong> {group.clientStep}</span>
                    </li>
                    {group.actions.map((a, idx) => (
                      <li className="step-item" key={idx}>
                        <span className="step-number">1.{idx + 1}</span>
                        <span className="step-text">
                          {a.action}
                          {a.note && (
                            <span style={{ display: 'block' }}>
                              <br />
                              <span style={{ opacity: 0.7, fontSize: 13 }}>Note: {a.note}</span>
                            </span>
                          )}
                          <br />
                          <span style={{ opacity: 0.7, fontSize: 13 }}>
                            Fee: {a.fee} · Processing Time: {a.time} · Responsible: {a.responsible}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>
                ))}

                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: '1px solid rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 600,
                  }}
                >
                  <span>Total</span>
                  <span>Fee: {TOTAL_PROCESSING.fee} · Processing Time: {TOTAL_PROCESSING.time}</span>
                </div>
              </div>
            )}
          </div>

          {info?.schedule && (
            <div className="note-panel" style={{ marginBottom: 24 }}>
              <div className="note-panel-icon"><IconCalendar size={18} /></div>
              <div>
                <h3 className="note-panel-title">Enrollment Schedule</h3>
                <p>{info.schedule}</p>
              </div>
            </div>
          )}

          <a
            href={onlineEnrollmentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg"
            style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <IconMonitor size={18} />
            Online Enrollment Portal
          </a>

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