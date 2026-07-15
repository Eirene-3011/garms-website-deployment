import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl, formatDateShort } from '../../utils/helpers';
import { IconMedal, IconStar, IconTrophy, IconCalendar } from '../../components/Icons';

const TABS = [
  { key: 'commendation', label: 'Commendations', Icon: IconMedal },
  { key: 'featured_student', label: 'Featured Student', Icon: IconStar },
  { key: 'accomplishment', label: 'Accomplishments', Icon: IconTrophy },
];

export default function StudentsCornerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get('tab') || 'commendation';
  const [tab, setTab] = useState(initialTab);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setTab(params.get('tab') || 'commendation'); }, [location.search]);

  useEffect(() => {
    setLoading(true);
    api.get(`/students?category=${tab}`).then(r => setItems(r.data)).finally(() => setLoading(false));
  }, [tab]);

  const activeTab = TABS.find(t => t.key === tab) || TABS[0];

  const selectTab = (key) => {
    if (key === tab) return;
    navigate(`${location.pathname}?tab=${key}`);
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › Students' Corner</div>
          <h1>Students' Corner</h1>
          <p>Celebrating our learners' achievements, accomplishments, and milestones</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="tab-nav" role="tablist" aria-label="Student recognition categories">
            {TABS.map(t => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                className={`tab-btn${tab === t.key ? ' tab-btn-active' : ''}`}
                onClick={() => selectTab(t.key)}
              >
                <t.Icon size={16} />
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div className="card" key={i}>
                  <div className="skeleton" style={{ width: '100%', height: 168, borderRadius: 0 }} />
                  <div className="student-card-body">
                    <div className="skeleton" style={{ width: '35%', height: 10, marginBottom: 12 }} />
                    <div className="skeleton" style={{ width: '65%', height: 14, marginBottom: 10 }} />
                    <div className="skeleton" style={{ width: '100%', height: 10, marginBottom: 6 }} />
                    <div className="skeleton" style={{ width: '80%', height: 10 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" aria-hidden="true"><activeTab.Icon size={22} /></div>
              <p>No {activeTab.label.toLowerCase()} entries yet. Check back soon!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {items.map(s => (
                <div key={s.id} className="card">
                  {s.image_url ? (
                    <img src={getImageUrl(s.image_url)} alt={s.student_name} className="student-card-media" />
                  ) : (
                    <div className="student-card-fallback">
                      <div className="student-card-fallback-icon" aria-hidden="true">
                        <activeTab.Icon size={26} />
                      </div>
                    </div>
                  )}
                  <div className="student-card-body">
                    {s.date_posted && (
                      <p className="student-card-date">
                        <IconCalendar size={12} />
                        {formatDateShort(s.date_posted)}
                      </p>
                    )}
                    {s.student_name && <h3 className="student-card-name">{s.student_name}</h3>}
                    {s.description && <p className="student-card-desc">{s.description}</p>}
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