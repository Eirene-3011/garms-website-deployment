import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export default function EnrollmentStatisticsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollment-stats').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › <Link to="/admissions">Admissions</Link> › Enrollment Statistics</div>
          <h1>Enrollment Statistics</h1>
          <p>Historical enrollment data for GARMS</p>
        </div>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          {loading ? (
            <div className="skeleton" style={{ width: '100%', height: 300, borderRadius: 10 }} />
          ) : stats.length === 0 ? (
            <div className="alert alert-info">Enrollment statistics are being compiled. Please check back soon.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--red-primary)', color: 'white' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>School Year</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700 }}>Grade Level</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700 }}>Male</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700 }}>Female</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((row, i) => (
                    <tr key={row.id} style={{ background: i % 2 === 0 ? 'white' : 'var(--gray-50)', borderBottom: '1px solid var(--gray-100)' }}>
                      <td style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--gray-900)' }}>{row.school_year}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'center', color: 'var(--gray-700)' }}>{row.grade_level}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'center', color: 'var(--gray-700)' }}>{row.male_count}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'center', color: 'var(--gray-700)' }}>{row.female_count}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 700, color: 'var(--red-primary)' }}>
                        {(row.male_count || 0) + (row.female_count || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
