import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function SchoolCalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/calendar').then(r => setEvents(r.data)).finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

  // Group events by month
  const grouped = {};
  events.forEach(e => {
    const m = new Date(e.event_date).getMonth();
    if (!grouped[m]) grouped[m] = [];
    grouped[m].push(e);
  });

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › School Calendar</div>
          <h1>School Calendar</h1>
          <p>Important dates and events for the school year</p>
        </div>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card" style={{ padding: '16px 20px' }}>
                  <div className="skeleton" style={{ width: '40%', height: 16, marginBottom: 8 }} />
                  <div className="skeleton" style={{ width: '70%', height: 10 }} />
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="alert alert-info">No calendar events have been posted yet.</div>
          ) : (
            <div>
              {Object.entries(grouped).sort(([a], [b]) => +a - +b).map(([month, evs]) => (
                <div key={month} style={{ marginBottom: 32 }}>
                  <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--red-primary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid var(--red-pale)' }}>
                    {MONTHS[+month]}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {evs.sort((a, b) => new Date(a.event_date) - new Date(b.event_date)).map(ev => (
                      <div key={ev.id} style={{ display: 'flex', gap: 16, padding: '14px 18px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: 10, alignItems: 'flex-start' }}>
                        <div style={{ flexShrink: 0, minWidth: 52, textAlign: 'center', background: 'var(--red-pale)', borderRadius: 8, padding: '8px 6px' }}>
                          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--red-primary)', textTransform: 'uppercase', margin: 0 }}>{MONTHS[+month]}</p>
                          <p style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--red-dark)', margin: 0, lineHeight: 1 }}>{new Date(ev.event_date).getDate()}</p>
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-900)', margin: '0 0 4px' }}>{ev.title}</h4>
                          {ev.description && <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', margin: 0 }}>{ev.description}</p>}
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
