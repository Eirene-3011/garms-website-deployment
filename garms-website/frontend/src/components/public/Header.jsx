import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSchoolInfo } from '../../hooks/useSchoolInfo';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';
import './Header.css';
import '../HomePage/HomePage.css'; // reuse the hero-slideshow styles used on the homepage

// Custom SVG Icons
const ChevronDownIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon" {...p}>
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </svg>
);

const SearchIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon" {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const CloseIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon" {...p}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const ArrowRightIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const SparkleIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z" />
  </svg>
);

// Faculty & Staff removed from navbar (now lives inside Organizational Structure page)
const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  {
    label: 'About Us', path: '/about',
    children: [
      { label: 'School Profile', path: '/about' },
      { label: 'Organizational Structure', path: '/about/organizational-structure' },
      { label: "Citizen's Charter", path: '/about/citizens-charter' },
      { label: 'Committees & Councils', path: '/about/committees' },
    ]
  },
  {
    label: 'Admissions', path: '/admissions',
    children: [
      { label: 'Enrollment Info', path: '/admissions' },
      { label: 'Enrollment Statistics', path: '/admissions/enrollment-statistics' },
    ]
  },
  { label: 'PPAs', path: '/ppas' },
  {
    label: "Students' Corner", path: '/students-corner',
    children: [
      { label: 'Commendations', path: '/students-corner?tab=commendation' },
      { label: 'Featured Student', path: '/students-corner?tab=featured_student' },
      { label: 'Student Accomplishments', path: '/students-corner?tab=accomplishment' },
    ]
  },
  { label: 'Accomplishments', path: '/accomplishments' },
  { label: 'Learning Resources', path: '/learning-resources' },
  {
    label: 'Issuances', path: '/issuances',
    children: [
      { label: 'DepEd Orders', path: '/issuances?type=deped_order' },
      { label: 'Procurement Postings', path: '/issuances?type=procurement' },
      { label: 'School Memos', path: '/issuances?type=memo' },
      { label: 'External Links', path: '/issuances#external' },
    ]
  },
  { label: 'Calendar', path: '/school-calendar' },
  {
    label: 'Contact Us', path: '/contact',
    children: [
      { label: 'Contact & Feedback', path: '/contact' },
      { label: 'FAQ', path: '/faq' },
    ]
  },
];

export default function Header() {
  const { info } = useSchoolInfo();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Search overlay
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  // Single general banner (no slideshow) — used as the hero background image
  const [banner, setBanner] = useState(null);
  const [bannerLoading, setBannerLoading] = useState(true);

  useEffect(() => {
    api.get('/banners')
      .then(r => {
        console.log('BANNERS RESPONSE:', r.data); // TEMP: confirm the API returns a general banner with image_url
        const general = (r.data || []).find(b => b.type === 'general');
        setBanner(general || null);
      })
      .catch((err) => console.error('Banner fetch failed:', err))
      .finally(() => setBannerLoading(false));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* Hero — single general banner as background, no slideshow */}
      <section className="hero-slideshow">
        {bannerLoading ? (
          <div className="hero-skeleton" aria-hidden="true" />
        ) : banner ? (
          <>
            <div className="hero-slide active">
              <img
                src={getImageUrl(banner.image_url)}
                alt={banner.title || ''}
                className="hero-slide-img"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="hero-slide-overlay" />
            </div>

            <div className="hero-overlay-content container">
              {info?.logo_url && (
                <img
                  src={getImageUrl(info.logo_url)}
                  alt="GARMS Logo"
                  className="hero-logo"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="hero-text-block">
                {banner.title && (
                  <span className="hero-eyebrow">
                    <SparkleIcon className="hero-eyebrow-icon" />{banner.title}
                  </span>
                )}
                <h1 className="hero-title">{info?.school_name || 'General Artemio Ricarte Memorial School'}</h1>
                <p className="hero-subtitle">{info?.motto || 'Empowering Artemians with Quality, Excellence, Service, and Resilience'}</p>
                <div className="hero-actions">
                  <Link to="/admissions" className="btn btn-primary btn-lg">Enroll Now<ArrowRightIcon className="btn-icon" /></Link>
                  <Link to="/about" className="btn btn-outline-light btn-lg">Learn More</Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Fallback when no general banner is set — gradient hero with school info */
          <div className="hero-fallback" aria-hidden="true">
            <div className="hero-fallback-pattern" />
            <div className="hero-overlay-content container">
              {info?.logo_url && (
                <img
                  src={getImageUrl(info.logo_url)}
                  alt="GARMS Logo"
                  className="hero-logo"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="hero-text-block">
                <span className="hero-eyebrow"><SparkleIcon className="hero-eyebrow-icon" />Welcome to GARMS</span>
                <h1 className="hero-title">{info?.school_name || 'General Artemio Ricarte Memorial School'}</h1>
                <p className="hero-subtitle">{info?.motto || 'Empowering Artemians with Quality, Excellence, Service, and Resilience'}</p>
                <div className="hero-actions">
                  <Link to="/admissions" className="btn btn-primary btn-lg">Enroll Now<ArrowRightIcon className="btn-icon" /></Link>
                  <Link to="/about" className="btn btn-outline-light btn-lg">Learn More</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Navigation */}
      <nav className={`navbar${scrolled ? ' navbar-sticky' : ''}`} ref={dropdownRef}>
        <div className="container nav-inner">
          <div className={`nav-menu${menuOpen ? ' open' : ''}`}>
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="nav-item"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => item.children && setActiveDropdown(null)}>
                <Link to={item.path}
                  className={`nav-link${location.pathname === item.path || location.pathname.startsWith(item.path + '/') ? ' active' : ''}`}
                  onClick={() => item.children ? null : toggleMenu()}
                  aria-haspopup={item.children ? "true" : "false"}
                  aria-expanded={item.children && activeDropdown === item.label ? "true" : "false"}>
                  {item.label}
                  {item.children && <ChevronDownIcon className="nav-caret" />}
                </Link>
                {item.children && activeDropdown === item.label && (
                  <div className="nav-dropdown">
                    {item.children.map(child => (
                      <Link key={child.label} to={child.path} className="dropdown-item" onClick={() => { setActiveDropdown(null); toggleMenu(); }}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="nav-actions">
            <button className="search-button" onClick={() => setSearchOpen(true)} aria-label="Open search">
              <SearchIcon />
            </button>
            <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={toggleMenu} aria-label="Toggle navigation menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && <div className="mobile-menu-overlay" onClick={toggleMenu}></div>}

      {/* Search Overlay */}
      <div className={`search-overlay${searchOpen ? ' open' : ''}`} role="dialog" aria-hidden={!searchOpen}>
        <form className="search-container" onSubmit={handleSearchSubmit}>
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Search the site..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="button" className="search-overlay-close" onClick={() => setSearchOpen(false)} aria-label="Close search">
            <CloseIcon />
          </button>
        </form>
      </div>
    </>
  );
}
