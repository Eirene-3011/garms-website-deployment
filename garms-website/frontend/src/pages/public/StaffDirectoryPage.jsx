import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';
import { IconSearch, IconUser, IconUsers } from '../../components/Icons';

const GRADES = ['All', 'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

export default function StaffDirectoryPage() {
  const [staff, setStaff] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/staff').then(r => setStaff(r.data)).finally(() => setLoading(false));
  }, []);

  // Close modal on Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setSelected(null);
  }, []);

  useEffect(() => {
    if (selected) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selected, handleKeyDown]);

  const filtered = staff.filter(s => {
    const matchGrade = filter === 'All' || s.department_grade_level === filter;
    const matchSearch = !search || s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.position_subject?.toLowerCase().includes(search.toLowerCase());
    return matchGrade && matchSearch;
  });

  const hasActiveFilters = filter !== 'All' || search;

  const clearFilters = () => {
    setFilter('All');
    setSearch('');
  };

  const openProfile = (s) => setSelected(s);

  const handleCardKeyDown = (e, s) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProfile(s);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › Faculty & Staff Directory</div>
          <h1>Faculty & Staff Directory</h1>
          <p>Meet the dedicated teachers and staff of General Artemio Ricarte Memorial School</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-input-wrap">
              <span className="search-input-icon" aria-hidden="true"><IconSearch size={16} /></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or position..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="form-control" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            {!loading && (
              <span className="result-count">
                <IconUsers size={14} />
                {filtered.length} staff member{filtered.length === 1 ? '' : 's'}
              </span>
            )}
          </div>

          {loading ? (
            <div className="staff-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="card official-card" key={i}>
                  <div className="skeleton" style={{ width: 112, height: 112, borderRadius: '50%', margin: '0 auto 16px' }} />
                  <div className="skeleton" style={{ width: '80%', height: 10, margin: '0 auto 8px' }} />
                  <div className="skeleton" style={{ width: '60%', height: 9, margin: '0 auto' }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" aria-hidden="true"><IconSearch size={22} /></div>
              <p>No staff found matching your criteria.</p>
              {hasActiveFilters && (
                <div style={{ marginTop: 16 }}>
                  <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear filters</button>
                </div>
              )}
            </div>
          ) : (
            <div className="staff-grid">
              {filtered.map(s => (
                <div
                  key={s.id}
                  className="card official-card official-card-clickable"
                  role="button"
                  tabIndex={0}
                  aria-label={`View profile for ${s.full_name}`}
                  onClick={() => openProfile(s)}
                  onKeyDown={(e) => handleCardKeyDown(e, s)}
                >
                  <div className="official-photo-wrap">
                    {s.photo_url ? (
                      <img src={getImageUrl(s.photo_url)} alt={s.full_name} className="avatar-photo avatar-photo-lg" />
                    ) : (
                      <div className="avatar-placeholder avatar-placeholder-accent avatar-placeholder-lg" aria-hidden="true">
                        <IconUser size={40} />
                      </div>
                    )}
                    <span className="official-photo-hint">View profile</span>
                  </div>
                  <p className="official-name">{s.full_name}</p>
                  <p className="official-position">{s.position_subject}</p>
                  {s.section_name && <p className="official-office">Section: {s.section_name}</p>}
                  {s.department_grade_level && (
                    <span className="badge badge-red" style={{ marginTop: 8, fontSize: '0.68rem' }}>
                      {s.department_grade_level}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Profile modal */}
      {selected && (
        <div
          className="staff-modal-overlay"
          onClick={() => setSelected(null)}
          role="presentation"
        >
          <div
            className="staff-modal card"
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.full_name} profile`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="staff-modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close profile"
            >
              &times;
            </button>

            <div className="staff-modal-photo-wrap">
              {selected.photo_url ? (
                <img
                  src={getImageUrl(selected.photo_url)}
                  alt={selected.full_name}
                  className="avatar-photo staff-modal-photo"
                />
              ) : (
                <div className="avatar-placeholder avatar-placeholder-accent staff-modal-photo" aria-hidden="true">
                  <IconUser size={56} />
                </div>
              )}
            </div>

            <h3 className="staff-modal-name">{selected.full_name}</h3>
            <p className="staff-modal-position">{selected.position_subject}</p>

            <div className="staff-modal-meta">
              {selected.section_name && (
                <div className="staff-modal-meta-item">
                  <span className="staff-modal-meta-label">Section</span>
                  <span className="staff-modal-meta-value">{selected.section_name}</span>
                </div>
              )}
              {selected.department_grade_level && (
                <div className="staff-modal-meta-item">
                  <span className="staff-modal-meta-label">Grade Level</span>
                  <span className="badge badge-red">{selected.department_grade_level}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}