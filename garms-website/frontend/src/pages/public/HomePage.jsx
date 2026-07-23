import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';
import './HomePage.css';

/* SVG Icons */
const UsersIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const UserCheckIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>
);
const BuildingIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" />
    <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
  </svg>
);
const TrendingUpIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);
const SchoolIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);
const ClipboardIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);
const GraduationIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);
const TrophyIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);
const StarIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const PhoneIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const ArrowRightIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const ChevronLeftIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRightIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const PauseIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);
const PlayIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M8 5v14l11-7z" />
  </svg>
);
const CalendarIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const QUICK_LINKS = [
  { label: 'About GARMS', desc: 'School profile & history', path: '/about', Icon: SchoolIcon, accent: 'red' },
  { label: 'Admissions', desc: 'Enrollment information', path: '/admissions', Icon: ClipboardIcon, accent: 'blue' },
  { label: 'Programs & Activities', desc: 'PPAs and events', path: '/ppas', Icon: GraduationIcon, accent: 'green' },
  { label: 'Accomplishments', desc: 'Awards & achievements', path: '/accomplishments', Icon: TrophyIcon, accent: 'purple' },
  { label: "Students' Corner", desc: 'Featured students', path: '/students-corner', Icon: StarIcon, accent: 'orange' },
  { label: 'Contact Us', desc: 'Get in touch', path: '/contact', Icon: PhoneIcon, accent: 'teal' },
];

const DASH_ICONS = [
  { Icon: UsersIcon, accent: 'red' },
  { Icon: UserCheckIcon, accent: 'blue' },
  { Icon: BuildingIcon, accent: 'green' },
  { Icon: TrendingUpIcon, accent: 'purple' },
];

/* ------------------------------------------------------------------
   useInView — lightweight scroll-reveal trigger (fires once)

   FIX: previously used `useRef` + a `useEffect` with deps `[threshold]`.
   That effect only runs once, right after the FIRST render. If the
   element the ref is attached to isn't in the DOM yet at that moment
   (e.g. the PPAs section, which only renders after an async fetch
   resolves and `ppas.length > 0`), `ref.current` is `null`, the
   IntersectionObserver never gets attached to anything, and the
   section is stuck at `opacity: 0` forever — even after it mounts.

   FIX: use a callback ref (`useCallback` returning a setter) instead
   of `useRef`. Every time React attaches the ref to a new/':existing
   DOM node — including the first time it appears after a conditional
   render — `setNode` fires, which is a dependency of the effect, so
   the observer gets (re)created against the real node whenever it
   actually exists.
   ------------------------------------------------------------------ */
function useInView(threshold = 0.2) {
  const [node, setNode] = useState(null);
  const [inView, setInView] = useState(false);

  // Callback ref: fires every time the DOM node this ref is attached
  // to changes (including going from null -> element once a
  // conditionally-rendered section finally mounts).
  const ref = useCallback((el) => {
    if (el) setNode(el);
  }, []);

  useEffect(() => {
    if (!node || inView) return;
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return; }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [node, threshold, inView]);

  return [ref, inView];
}

/* ------------------------------------------------------------------
   useCountUp — animates a number from 0 to target once triggered
   ------------------------------------------------------------------ */
function useCountUp(target, start, duration = 1300) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start || typeof target !== 'number' || Number.isNaN(target)) return;
    let raf;
    let startTime = null;
    const step = (ts) => {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value;
}

function KpiValue({ value, start, small }) {
  const isNumeric = typeof value === 'number';
  const count = useCountUp(isNumeric ? value : 0, start && isNumeric);
  const display = isNumeric ? count.toLocaleString() : value;
  return <p className={`kpi-value${small ? ' kpi-value-sm' : ''}`}>{display}</p>;
}

export default function HomePage() {
  const [dashboard, setDashboard] = useState(null);
  const [ppas, setPpas] = useState([]);
  const [loadingDash, setLoadingDash] = useState(true);

  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    api.get('/school-dashboard').then(r => setDashboard(r.data)).catch(() => {}).finally(() => setLoadingDash(false));
    api.get('/ppas').then(r => setPpas(r.data.slice(0, 3))).catch(() => {});
    // Fetch only seasonal banners — exclude general banners
    api.get('/banners')
      .then(r => {
        const seasonal = (r.data || []).filter(b => b.type !== 'general');
        setBanners(seasonal);
      })
      .catch(() => {})
      .finally(() => setBannersLoading(false));
  }, []);

  useEffect(() => {
    if (banners.length <= 1 || !autoplay) return;
    const timer = setInterval(() => setCurrentBanner(p => (p + 1) % banners.length), 6000);
    return () => clearInterval(timer);
  }, [banners.length, autoplay]);

  const goToBanner = useCallback((i) => { setCurrentBanner(i); setAutoplay(false); }, []);
  const prevBanner = useCallback(() => setCurrentBanner(p => (p - 1 + banners.length) % banners.length), [banners.length]);
  const nextBanner = useCallback(() => setCurrentBanner(p => (p + 1) % banners.length), [banners.length]);

  const banner = banners[currentBanner];
  const dashStats = dashboard?.stats || {};
  const grades = dashboard?.grades || [];

  const dashItems = [
    { label: 'Total Enrollment', value: dashStats.enrollment_count != null ? Number(dashStats.enrollment_count) : '—', small: false },
    { label: 'Teaching Personnel', value: dashStats.teaching_personnel != null ? Number(dashStats.teaching_personnel) : '—', small: false },
    { label: 'Non-Teaching Personnel', value: dashStats.non_teaching_personnel != null ? Number(dashStats.non_teaching_personnel) : '—', small: false },
    { label: 'Performance Indicator', value: dashStats.performance_indicator ?? '—', small: true },
  ];

  const hasBanners = banners.length > 0;

  const [dashRef, dashInView] = useInView(0.15);
  const [quickRef, quickInView] = useInView(0.15);
  const [ppaRef, ppaInView] = useInView(0.15);
  const [ctaRef, ctaInView] = useInView(0.3);

  return (
    <div className="homepage">
      {/* ============================================================
          Hero — Seasonal Slideshow, image only (no text overlay)
          ============================================================ */}
      <section
        className="hero-slideshow"
        onMouseEnter={() => banners.length > 1 && setAutoplay(false)}
        onMouseLeave={() => banners.length > 1 && setAutoplay(true)}
      >
        {bannersLoading ? (
          <div className="hero-skeleton" aria-hidden="true" />
        ) : hasBanners && banner ? (
          <>
            <div className="hero-slide-track">
              {banners.map((b, i) => (
                <div key={i} className={`hero-slide${i === currentBanner ? ' active' : ''}`} aria-hidden={i !== currentBanner}>
                  <img src={getImageUrl(b.image_url)} alt={b.title || ''} className="hero-slide-img" onError={(e) => { e.target.style.display = 'none'; }} />
                  <div className="hero-slide-overlay" />
                </div>
              ))}
            </div>

            {banners.length > 1 && (
              <>
                <button className="hero-nav hero-nav-prev" onClick={prevBanner} aria-label="Previous banner"><ChevronLeftIcon /></button>
                <button className="hero-nav hero-nav-next" onClick={nextBanner} aria-label="Next banner"><ChevronRightIcon /></button>
                <div className="hero-controls">
                  <button type="button" className="hero-toggle" onClick={() => setAutoplay(a => !a)} aria-label={autoplay ? 'Pause slideshow' : 'Play slideshow'} title={autoplay ? 'Pause' : 'Play'}>
                    {autoplay ? <PauseIcon className="hero-toggle-icon" /> : <PlayIcon className="hero-toggle-icon" />}
                  </button>
                  <div className="hero-dots" role="tablist" aria-label="Banner navigation">
                    {banners.map((_, i) => (
                      <button key={i} role="tab" aria-selected={i === currentBanner} aria-label={`Show banner ${i + 1}`} className={`hero-dot${i === currentBanner ? ' active' : ''}`} onClick={() => goToBanner(i)} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          /* Fallback when no seasonal banners — quiet decorative gradient, no copy */
          <div className="hero-fallback" aria-hidden="true">
            <div className="hero-fallback-pattern" />
          </div>
        )}
      </section>

      {/* Signature ribbon divider — a nod to service-ribbon colors, ties the
          banner to the identity band below without needing any copy */}
      <div className="ribbon-divider" aria-hidden="true" />

      {/* ============================================================
          School Dashboard
          ============================================================ */}
      <section className="section dashboard-section" ref={dashRef}>
        <div className="container">
          <div className={`section-header reveal${dashInView ? ' in-view' : ''}`}>
            <h2 className="section-title">School Dashboard</h2>
            <span className="title-accent title-accent-center" aria-hidden="true" />
            <p className="section-subtitle">Key statistics and performance indicators for the current school year.</p>
          </div>

          {loadingDash ? (
            <div className="kpi-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="kpi-card kpi-skeleton">
                  <div className="skeleton skeleton-icon" /><div className="skeleton skeleton-num" /><div className="skeleton skeleton-label" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className={`kpi-grid${dashInView ? ' in-view' : ''}`}>
                {dashItems.map((item, i) => {
                  const { Icon, accent } = DASH_ICONS[i];
                  return (
                    <div key={item.label} className={`kpi-card accent-${accent}`}>
                      <div className="kpi-icon-wrap"><Icon className="kpi-icon" /></div>
                      <KpiValue value={item.value} start={dashInView} small={item.small} />
                      <p className="kpi-label">{item.label}</p>
                    </div>
                  );
                })}
              </div>

              {grades.length > 0 && (
                <div className={`grade-table-card reveal${dashInView ? ' in-view' : ''}`}>
                  <div className="grade-table-header">
                    <CalendarIcon className="grade-table-icon" /><h3>Grade-Level Breakdown</h3>
                  </div>
                  <div className="grade-table-wrap">
                    <table className="grade-table">
                      <thead><tr><th>Grade Level</th><th className="td-center">Sections</th><th className="td-center">Classrooms</th></tr></thead>
                      <tbody>
                        {grades.map(g => (
                          <tr key={g.grade_level}><td className="td-bold">{g.grade_level}</td><td className="td-center">{g.sections_count}</td><td className="td-center">{g.classrooms_count}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ============================================================
          Quick Access
          ============================================================ */}
      <section className="section quick-links-section" ref={quickRef}>
        <div className="container">
          <div className={`section-header reveal${quickInView ? ' in-view' : ''}`}>
            <h2 className="section-title">Quick Access</h2>
            <span className="title-accent title-accent-center" aria-hidden="true" />
            <p className="section-subtitle">Jump directly to the most visited sections of our portal.</p>
          </div>
          <div className={`quick-links-grid${quickInView ? ' in-view' : ''}`}>
            {QUICK_LINKS.map(({ label, desc, path, Icon, accent }) => (
              <Link key={label} to={path} className={`quick-link-card accent-${accent}`}>
                <div className="ql-icon-wrap"><Icon className="ql-icon" /></div>
                <div className="ql-body"><span className="ql-label">{label}</span><span className="ql-desc">{desc}</span></div>
                <ArrowRightIcon className="ql-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          Recent PPAs

          FIX CONTEXT: this whole <section> only mounts once
          `ppas.length > 0` (i.e. after the async `/ppas` fetch
          resolves). With the old `useInView` (useRef-based), `ppaRef`
          was never attached to a live DOM node at the time its effect
          ran, so the IntersectionObserver was never created and
          `ppaInView` stayed `false` forever — meaning `.reveal` /
          `.ppas-grid` never got `.in-view` and stayed invisible
          (`opacity: 0`). The fixed callback-ref version re-runs its
          effect whenever the node changes, so this now works
          correctly even though the section mounts late.
          ============================================================ */}
      {ppas.length > 0 && (
        <section className="section ppas-section" ref={ppaRef}>
          <div className="container">
            <div className="section-row">
              <div className={`section-header section-header-left reveal${ppaInView ? ' in-view' : ''}`}>
                <h2 className="section-title">Programs &amp; Activities</h2>
                <span className="title-accent title-accent-left" aria-hidden="true" />
              </div>
              <Link to="/ppas" className="view-all-link">View All<ArrowRightIcon className="view-all-icon" /></Link>
            </div>
            <div className={`ppas-grid${ppaInView ? ' in-view' : ''}`}>
              {ppas.map(p => (
                <div key={p.id} className="ppa-card">
                  {p.image_url && (
                    <div className="ppa-image-wrap"><img src={getImageUrl(p.image_url)} alt={p.name} className="ppa-image" onError={e => e.target.style.display = 'none'} /></div>
                  )}
                  <div className="ppa-body">
                    <h3 className="ppa-name">{p.name}</h3>
                    <Link to="/ppas" className="ppa-link">Read more<ArrowRightIcon className="ppa-link-icon" /></Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          CTA
          ============================================================ */}
      <section className="cta-section" ref={ctaRef}>
        <div className="cta-pattern" />
        <div className={`container cta-inner reveal${ctaInView ? ' in-view' : ''}`}>
          <div className="cta-text">
            <h2>Ready to join the GARMS community?</h2>
            <p>Take the first step toward quality education. Enroll today or reach out to learn more about our programs and offerings.</p>
          </div>
          <div className="cta-actions">
            <Link to="/admissions" className="btn btn-primary btn-lg">Enroll Now<ArrowRightIcon className="btn-icon" /></Link>
            <Link to="/contact" className="btn btn-outline-light btn-lg">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
