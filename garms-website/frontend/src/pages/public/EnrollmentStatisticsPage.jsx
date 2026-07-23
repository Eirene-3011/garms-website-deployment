import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const GRADE_ORDER = ['Kinder', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

function gradeSortIndex(label) {
  const i = GRADE_ORDER.indexOf(label);
  return i === -1 ? GRADE_ORDER.length : i;
}

// Groups flat rows (one row per school_year + grade_level) into
// one object per school year, with a grades map and computed totals.
function groupBySchoolYear(rows) {
  const map = new Map();

  rows.forEach(row => {
    const key = row.school_year;
    if (!map.has(key)) {
      map.set(key, { school_year: key, grades: [], total_male: 0, total_female: 0 });
    }
    const entry = map.get(key);
    const male = Number(row.male_count) || 0;
    const female = Number(row.female_count) || 0;

    entry.grades.push({ label: row.grade_level, male, female, total: male + female });
    entry.total_male += male;
    entry.total_female += female;
  });

  return Array.from(map.values())
    .map(e => ({
      ...e,
      grades: e.grades.sort((a, b) => gradeSortIndex(a.label) - gradeSortIndex(b.label)),
      grand_total: e.total_male + e.total_female,
    }))
    // newest school year first
    .sort((a, b) => String(b.school_year).localeCompare(String(a.school_year)));
}

function EnrollTable({ year }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid var(--gray-100)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', minWidth: 480 }}>
        <thead>
          <tr style={{ background: 'var(--red-primary)', color: 'white' }}>
            <th style={th}>Grade Level</th>
            <th style={{ ...th, textAlign: 'center' }}>Male</th>
            <th style={{ ...th, textAlign: 'center' }}>Female</th>
            <th style={{ ...th, textAlign: 'center' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {year.grades.map((g, i) => (
            <tr
              key={g.label}
              style={{
                background: i % 2 === 0 ? 'white' : 'var(--gray-50)',
                borderBottom: '1px solid var(--gray-100)',
              }}
            >
              <td style={{ ...td, fontWeight: 600, color: 'var(--gray-900)' }}>{g.label}</td>
              <td style={{ ...td, textAlign: 'center', color: 'var(--gray-700)' }}>{g.male}</td>
              <td style={{ ...td, textAlign: 'center', color: 'var(--gray-700)' }}>{g.female}</td>
              <td style={{ ...td, textAlign: 'center', fontWeight: 700, color: 'var(--red-primary)' }}>
                {g.total}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: 'var(--gray-50)', fontWeight: 700 }}>
            <td style={{ ...td, borderBottom: 'none' }}>Total</td>
            <td style={{ ...td, textAlign: 'center', borderBottom: 'none' }}>{year.total_male}</td>
            <td style={{ ...td, textAlign: 'center', borderBottom: 'none' }}>{year.total_female}</td>
            <td style={{ ...td, textAlign: 'center', color: 'var(--red-primary)', fontSize: '1rem', borderBottom: 'none' }}>
              {year.grand_total}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

const th = { padding: '12px 16px', textAlign: 'left', fontWeight: 700, whiteSpace: 'nowrap' };
const td = { padding: '10px 16px' };

export default function EnrollmentStatisticsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollment-stats')
      .then(r => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  const years = groupBySchoolYear(stats);
  const totalsStrip = [...years].reverse(); // oldest first, so trend arrows read left-to-right

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> › <Link to="/admissions">Admissions</Link> › Enrollment Statistics
          </div>
          <h1>Enrollment Statistics</h1>
          <p>Historical enrollment data for GARMS</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 960 }}>

          {loading ? (
            <div className="skeleton" style={{ width: '100%', height: 300, borderRadius: 10 }} />
          ) : stats.length === 0 ? (
            <div className="alert alert-info">Enrollment statistics are being compiled. Please check back soon.</div>
          ) : (
            <>
              {/* Year-over-year summary strip */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
                {totalsStrip.map((y, i) => {
                  const prev = totalsStrip[i - 1];
                  const diff = prev ? y.grand_total - prev.grand_total : null;
                  return (
                    <div
                      key={y.school_year}
                      className="stat-card"
                      style={{
                        flex: '1 1 160px',
                        minWidth: 140,
                        padding: '16px 18px',
                        borderRadius: 12,
                        border: '1px solid var(--gray-100)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      }}
                    >
                      <p style={{ fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#999', marginBottom: 6, fontWeight: 600 }}>
                        SY {y.school_year}
                      </p>
                      <p style={{ fontSize: '1.9rem', lineHeight: 1, fontWeight: 800, color: 'var(--gray-900)' }}>
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

              {/* One card per school year (newest first) */}
              {years.map(y => (
                <div
                  key={y.school_year}
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
                    Enrollment Count
                  </h2>

                  <EnrollTable year={y} />

                  <div style={{
                    marginTop: 16,
                    display: 'flex',
                    gap: 24,
                    flexWrap: 'wrap',
                    fontSize: '0.85rem',
                    color: 'var(--gray-700)',
                  }}>
                    <span>👨 <strong>{y.total_male}</strong> Male</span>
                    <span>👩 <strong>{y.total_female}</strong> Female</span>
                    <span style={{ fontWeight: 700, color: 'var(--red-primary)' }}>
                      Total: {Number(y.grand_total).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
