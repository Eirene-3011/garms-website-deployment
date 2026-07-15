import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import { IconCalendar, IconRepeat } from '../../components/Icons';

const CAT_COLORS = { academic: 'badge-blue', holiday: 'badge-red', event: 'badge-gold', special: 'badge-green', general: 'badge-gray' };
const CAT_DOTS = { academic: 'var(--info)', holiday: 'var(--red-primary)', event: 'var(--warning)', special: 'var(--success)', general: 'var(--gray-400)' };
const FILTERS = ['all', 'academic', 'holiday', 'event', 'special'];

export default function SchoolCalendarPage() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/calendar').then(r => setEvents(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? events : events.filter(e => e.category === filter);

  const groupByMonth = (evts) => {
    const groups = {};
    evts.forEach(e => {
      const d = new Date(e.start_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('en-PH', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = { label, items: [] };
      groups[key].items.push(e);
    });
    return Object.values(groups);
  };

  const grouped = groupByMonth(filtered);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › School Calendar</div>
          <h1>School Calendar</h1>
          <p>Key dates, events, and important milestones for the school year</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }} role="tablist" aria-label="Event category">
            {FILTERS.map(c => (
              <button
                key={c}
                role="tab"
                aria-selected={filter === c}
                onClick={() => setFilter(c)}
                className={`btn ${filter === c ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                style={{ textTransform: 'capitalize' }}
              >
                {c === 'all' ? (
                  <IconCalendar size={14} />
                ) : (
                  <span className="filter-dot" style={{ background: filter === c ? 'var(--white)' : CAT_DOTS[c] }} aria-hidden="true" />
                )}
                {c === 'all' ? 'All Events' : c}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="event-row" key={i}>
                  <div className="skeleton" style={{ width: 48, height: 52, borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ width: '55%', height: 12, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: '30%', height: 10 }} />
                  </div>
                  <div className="skeleton" style={{ width: 70, height: 20, borderRadius: 'var(--radius-pill)' }} />
                </div>
              ))}
            </div>
          ) : grouped.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" aria-hidden="true"><IconCalendar size={22} /></div>
              <p>{filter === 'all' ? 'No events to display.' : `No ${filter} events to display.`}</p>
            </div>
          ) : (
            grouped.map(g => (
              <div key={g.label} className="month-group">
                <h3 className="month-group-label">
                  <IconCalendar size={14} />
                  {g.label}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {g.items.map(ev => (
                    <div key={ev.id} className="event-row">
                      <div className="date-chip">
                        <span className="date-chip-month">{new Date(ev.start_date).toLocaleString('en-PH', { month: 'short' })}</span>
                        <span className="date-chip-day">{new Date(ev.start_date).getDate()}</span>
                      </div>
                      <div className="event-info">
                        <p className="event-name">{ev.event_name}</p>
                        <p className="event-dates">
                          {formatDate(ev.start_date)}{ev.end_date && ev.end_date !== ev.start_date ? ` — ${formatDate(ev.end_date)}` : ''}
                        </p>
                      </div>
                      <div className="event-badges">
                        <span className={`badge ${CAT_COLORS[ev.category] || 'badge-gray'}`}>{ev.category}</span>
                        {ev.is_recurring && (
                          <span className="badge badge-gray badge-recurring">
                            <IconRepeat size={11} />
                            Recurring
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}