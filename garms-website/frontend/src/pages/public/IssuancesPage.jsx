import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl, formatDateShort } from '../../utils/helpers';
import {
  IconClipboard,
  IconFileText,
  IconMegaphone,
  IconBuilding,
  IconPaperclip,
  IconDownload,
  IconCalendar,
  IconX,
  IconExternalLink,
} from '../../components/Icons';

const TYPES = [
  { key: 'deped_order', label: 'DepEd Orders', Icon: IconClipboard },
  { key: 'memo', label: 'School Memos', Icon: IconFileText },
  { key: 'notice_of_meeting', label: 'Notices', Icon: IconMegaphone },
  { key: 'procurement', label: 'Procurement', Icon: IconBuilding },
  { key: 'form', label: 'Forms', Icon: IconPaperclip },
];

export default function IssuancesPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initType = params.get('type') || 'deped_order';
  const [activeType, setActiveType] = useState(initType);
  const [issuances, setIssuances] = useState([]);
  const [externalLinks, setExternalLinks] = useState([]);
  const [yearFilter, setYearFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { setActiveType(params.get('type') || 'deped_order'); }, [location.search]);

  useEffect(() => {
    setLoading(true);
    const url = `/issuances?type=${activeType}${yearFilter ? `&year=${yearFilter}` : ''}`;
    api.get(url).then(r => setIssuances(r.data)).finally(() => setLoading(false));
    api.get('/external-links').then(r => setExternalLinks(r.data)).catch(() => {});
  }, [activeType, yearFilter]);

  const years = ['2026', '2025', '2024', '2023'];
  const activeCat = TYPES.find(t => t.key === activeType) || TYPES[0];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › Issuances</div>
          <h1>Issuances & Transparency</h1>
          <p>DepEd Orders, school memos, notices, procurement postings, and official forms</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Type tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }} role="tablist" aria-label="Issuance type">
            {TYPES.map(t => (
              <button
                key={t.key}
                role="tab"
                aria-selected={activeType === t.key}
                onClick={() => setActiveType(t.key)}
                className={`btn ${activeType === t.key ? 'btn-primary' : 'btn-ghost'}`}
              >
                <t.Icon size={16} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Year filter for DepEd Orders */}
          {activeType === 'deped_order' && (
            <div className="filter-bar">
              <span className="filter-bar-label">
                <IconCalendar size={16} />
                Filter by School Year
              </span>
              <select className="form-control" style={{ width: 'auto' }} value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
                <option value="">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              {yearFilter && (
                <button className="btn btn-ghost btn-sm" onClick={() => setYearFilter('')}>
                  <IconX size={14} />
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Issuances list */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="issuance-row" key={i}>
                  <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)' }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ width: '50%', height: 12, marginBottom: 10 }} />
                    <div className="skeleton" style={{ width: '25%', height: 10 }} />
                  </div>
                  <div className="skeleton" style={{ width: 96, height: 32, borderRadius: 'var(--radius-md)' }} />
                </div>
              ))}
            </div>
          ) : issuances.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" aria-hidden="true"><activeCat.Icon size={22} /></div>
              <p>No {activeCat.label.toLowerCase()} records available yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {issuances.map(iss => (
                <div key={iss.id} className="issuance-row">
                  <div className="issuance-icon" aria-hidden="true">
                    <activeCat.Icon size={20} />
                  </div>
                  <div className="issuance-info">
                    <p className="issuance-title">{iss.title}</p>
                    <div className="issuance-meta">
                      {iss.do_number && <span className="badge badge-red">{iss.do_number}</span>}
                      {iss.school_year && <span className="badge badge-gold">SY {iss.school_year}</span>}
                      {iss.date_issued && (
                        <span className="issuance-date">
                          <IconCalendar size={12} />
                          {formatDateShort(iss.date_issued)}
                        </span>
                      )}
                    </div>
                  </div>
                  {iss.file_url ? (
                    <a href={getImageUrl(iss.file_url)} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                      <IconDownload size={14} />
                      Download
                    </a>
                  ) : (
                    <span className="badge badge-gray">Link Pending</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* External DepEd Links */}
          {externalLinks.length > 0 && (
            <div id="external" style={{ marginTop: 48 }}>
              <span className="section-eyebrow">Beyond GARMS</span>
              <h2 className="section-title" style={{ marginBottom: 20, display: 'block' }}>External DepEd References</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                {externalLinks.map(l => (
                  <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" className="external-link-card card">
                    <span className="external-link-icon" aria-hidden="true"><IconExternalLink size={16} /></span>
                    <span className="external-link-label">{l.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}