import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';

const LEVELS = [
  { key: 'kinder',  label: 'Kinder'  },
  { key: 'grade1',  label: 'Grade 1' },
  { key: 'grade2',  label: 'Grade 2' },
  { key: 'grade3',  label: 'Grade 3' },
  { key: 'grade4',  label: 'Grade 4' },
  { key: 'grade5',  label: 'Grade 5' },
  { key: 'grade6',  label: 'Grade 6' },
];

function EnrollTable({ row }) {
  return (
    <div
      style={{
        overflowX: 'auto',
        borderRadius: 10,
        border: '1px solid #ececec',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.93rem', minWidth: 480 }}>
        <thead>
          <tr>
            <th style={th}>Grade Level</th>
            <th style={{ ...th, textAlign: 'right' }}>Male</th>
            <th style={{ ...th, textAlign: 'right' }}>Female</th>
            <th style={{ ...th, textAlign: 'right', background: 'var(--red-dark, #7a0000)' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {LEVELS.map((l, i) => {
            const m = Number(row[`${l.key}_male`]   || 0);
            const f = Number(row[`${l.key}_female`] || 0);
            const t = m + f;
            return (
              <tr
                key={l.key}
                style={{ background: i % 2 === 0 ? '#fff' : '#faf9f9' }}
              >
                <td style={{ ...td, fontWeight: 500 }}>{l.label}</td>
                <td style={{ ...td, textAlign: 'right', color: '#444' }}>{m}</td>
                <td style={{ ...td, textAlign: 'right', color: '#444' }}>{f}</td>
                <td style={{ ...td, textAlign: 'right', fontWeight: 700 }}>{t}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr style={{ background: '#f5f2f2', fontWeight: 700 }}>
            <td style={{ ...td, borderBottom: 'none' }}>Total</td>
            <td style={{ ...td, textAlign: 'right', borderBottom: 'none' }}>{row.total_male}</td>
            <td style={{ ...td, textAlign: 'right', borderBottom: 'none' }}>{row.total_female}</td>
            <td style={{ ...td, textAlign: 'right', color: 'var(--red-primary)', fontSize: '1.05rem', borderBottom: 'none' }}>
              {row.grand_total}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

const th = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  color: '#fff',
  background: 'var(--red-primary)',
  fontSize: '0.82rem',
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
};
const td = { padding: '10px 16px', borderBottom: '1px solid #eee' };

export default function EnrollmentStatisticsPage() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollment-stats')
      .then(r => setYears(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Year-over-year grand totals for the summary strip
  const totalsStrip = [...years].reverse(); // oldest first for trend arrow

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> › <Link to="/admissions">Admissions</Link> › Enrollment Statistics
          </div>
          <h1>Enrollment Statistics</h1>
          <p>BOSY (Beginning of School Year) enrollment headcount by grade level and sex</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 960 }}>

          {/* Year-over-year summary strip */}
          {years.length > 0 && (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
              {totalsStrip.map((y, i) => {
                const prev = totalsStrip[i - 1];
                const diff = prev ? y.grand_total - prev.grand_total : null;
                return (
                  <div
                    key={y.id}
                    className="stat-card"
                    style={{
                      flex: '1 1 160px',
                      minWidth: 140,
                      borderRadius: 12,
                      border: '1px solid #eee',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    <p style={{ fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#999', marginBottom: 6, fontWeight: 600 }}>
                      SY {y.school_year}
                    </p>
                    <p style={{ fontSize: '1.9rem', lineHeight: 1, fontWeight: 800, color: '#222' }}>
                      {Number(y.grand_total).toLocaleString()}
                    </p>
                    <p style={{
                      fontSize: '0.75rem',
                      marginTop: 8,
                      fontWeight: 600,
                      color: diff === null ? '#888' : diff > 0 ? '#1a7f37' : diff < 0 ? 'var(--red-primary)' : '#888',
                    }}>
                      {diff !== null
                        ? (diff > 0 ? `▲ +${diff} from prev. SY` : diff < 0 ? `▼ ${diff} from prev. SY` : '— No change')
                        : 'Learners enrolled'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}>
              Loading enrollment data…
            </div>
          )}

          {!loading && years.length === 0 && (
            <div className="note-panel">
              <p>No enrollment statistics have been published yet. Check back soon.</p>
            </div>
          )}

          {/* One card per school year (newest first) */}
          {years.map(y => (
            <div
              key={y.id}
              className="card"
              style={{
                padding: 32,
                marginBottom: 32,
                borderRadius: 14,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              }}
            >
              <h2 style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--red-primary)',
                marginBottom: 22,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <span style={{
                  background: 'var(--red-primary)',
                  color: '#fff',
                  borderRadius: 6,
                  padding: '3px 12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}>
                  SY {y.school_year}
                </span>
                BOSY Enrollment Count
              </h2>

              {/* Data table on top */}
              <EnrollTable row={y} />

              <div style={{
                marginTop: 16,
                marginBottom: y.chart_image_url ? 28 : 0,
                display: 'flex',
                gap: 24,
                flexWrap: 'wrap',
                fontSize: '0.85rem',
                color: '#555',
              }}>
                <span>👨 <strong>{y.total_male}</strong> Male</span>
                <span>👩 <strong>{y.total_female}</strong> Female</span>
                <span style={{ fontWeight: 700, color: 'var(--red-primary)' }}>
                  Total: {Number(y.grand_total).toLocaleString()}
                </span>
              </div>

              {/* Chart image, full width, below the table */}
              {y.chart_image_url && (
                <div>
                  <div style={{
                    height: 1,
                    background: '#eee',
                    marginBottom: 24,
                  }} />
                  <p style={{
                    fontSize: '0.72rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: '#999',
                    fontWeight: 600,
                    marginBottom: 10,
                  }}>
                    Enrollment Chart
                  </p>
                  <div style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: '1px solid #eee',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}>
                    <img
                      src={getImageUrl(y.chart_image_url)}
                      alt={`Enrollment chart SY ${y.school_year}`}
                      style={{ width: '100%', display: 'block' }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="divider" />
          <div className="cta-panel">
            <p>Ready to enroll your child at GARMS?</p>
            <Link to="/admissions" className="btn btn-outline">View Enrollment Info</Link>
          </div>
        </div>
      </section>
    </div>
  );
}