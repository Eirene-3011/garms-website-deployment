import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSchoolInfo } from '../../hooks/useSchoolInfo';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';
import './Header.css';

// Custom SVG Icons
const ChevronDownIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon" {...p}>
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </svg>
);

const FacebookIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="social-icon" {...p}>
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z" />
  </svg>
);

const YoutubeIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="social-icon" {...p}>
    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.6 15.6V8.4l6.27 3.6-6.27 3.6z" />
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

const PauseIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);

const PlayIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M8 5v14l11-7z" />
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

  // Banner carousel (moved over from HomePage — same data/behavior)
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    api.get('/banners')
      .then(r => {
        // Only show general banners in the header carousel — seasonal banners are excluded here.
        const generalOnly = (r.data || []).filter(b => b.banner_type === 'general');
        setBanners(generalOnly);
      })
      .catch(() => {})
      .finally(() => setBannersLoading(false));
  }, []);

  useEffect(() => {
    if (banners.length <= 1 || !autoplay) return;
    const timer = setInterval(() => setCurrentBanner(p => (p + 1) % banners.length), 6000);
    return () => clearInterval(timer);
  }, [banners.length, autoplay]);

  const goToBanner = useCallback((i) => {
    setCurrentBanner(i);
    setAutoplay(false);
  }, []);

  const banner = banners[currentBanner];

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
      {/* Hero banner strip — full width & full height, image shown in full (no crop) */}
      <div className="header-hero">
        {bannersLoading ? (
          <div className="hero-banner-skeleton" aria-hidden="true" />
        ) : banner ? (
          <div
            className="hero-banner-frame"
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            <img
              src={getImageUrl(banner.image_url)}
              alt={banner.title || ''}
              className="hero-banner-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />

            {banners.length > 1 && (
              <div className="banner-controls">
                <button
                  type="button"
                  className="banner-toggle"
                  onClick={() => setAutoplay((a) => !a)}
                  aria-label={autoplay ? 'Pause banner slideshow' : 'Play banner slideshow'}
                  title={autoplay ? 'Pause' : 'Play'}
                >
                  {autoplay ? <PauseIcon className="banner-toggle-icon" /> : <PlayIcon className="banner-toggle-icon" />}
                </button>
                <div className="banner-dots" role="tablist" aria-label="Banner navigation">
                  {banners.map((_, i) => (
                    <button
                      key={i}
                      role="tab"
                      aria-selected={i === currentBanner}
                      aria-label={`Show banner ${i + 1}`}
                      className={`dot${i === currentBanner ? ' active' : ''}`}
                      onClick={() => goToBanner(i)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="hero-banner-fallback" aria-hidden="true" />
        )}

        <Link to="/" className="hero-brand" aria-label="Go to Home Page">
          <img
            src={getImageUrl(info?.logo_url) || '/uploads/logo.png'}
            alt="GARMS Logo"
            className="hero-logo"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </Link>
      </div>

      {/* Social / portal utility bar */}
      <div className="header-utility">
        <div className="container utility-inner">
        </div>
      </div>

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
