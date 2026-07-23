import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSchoolInfo } from '../../hooks/useSchoolInfo';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';
import './Header.css';

// Custom SVG Icons
const ChevronDownIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="6 9 12 15 18 9" />
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

const NavItem = ({ item, location, onLinkClick }) => {
  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleEnter = () => {
    if (item.children) {
      clearTimeout(timeoutRef.current);
      setIsOpen(true);
    }
  };

  const handleLeave = () => {
    if (item.children) {
      timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
    }
  };

  return (
    <div
      className="nav-item"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        to={item.path}
        className={`nav-link${isActive ? ' active' : ''}`}
        onClick={() => { if (!item.children) onLinkClick(); }}
        aria-haspopup={item.children ? "true" : "false"}
        aria-expanded={item.children && isOpen ? "true" : "false"}
      >
        <span className="nav-link-text">{item.label}</span>
        {item.children && <ChevronDownIcon className="nav-caret" />}
      </Link>
      {item.children && (
        <div className={`nav-dropdown${isOpen ? ' visible' : ''}`}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <div className="dropdown-content">
            {item.children.map((child, idx) => (
              <Link
                key={child.label}
                to={child.path}
                className={`dropdown-item${idx === 0 ? ' first' : ''}`}
                onClick={() => { setIsOpen(false); onLinkClick(); }}
              >
                <span className="dropdown-dot" />
                <span className="dropdown-label">{child.label}</span>
                <ArrowRightIcon className="dropdown-arrow" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Single general banner
  const [banner, setBanner] = useState(null);
  const [bannerLoading, setBannerLoading] = useState(true);

  useEffect(() => {
    api.get('/banners')
      .then((r) => {
        const data = r.data || [];
        const general = data.find((b) => b.type === 'general');
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
    setMobileDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMobileDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleMobileDropdown = (label) =>
    setMobileDropdown((prev) => (prev === label ? null : label));

  return (
    <>
      {/* Hero banner — single general banner, full width */}
      <div className="header-hero">
        {bannerLoading ? (
          <div className="hero-banner-skeleton" aria-hidden="true" />
        ) : banner ? (
          <div className="hero-banner-frame">
            <img
              src={getImageUrl(banner.image_url)}
              alt={banner.title || ''}
              className="hero-banner-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="hero-slide-overlay" />

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
                    <SparkleIcon className="hero-eyebrow-icon" />
                    {banner.title}
                  </span>
                )}
                <h1 className="hero-title">
                  {info?.school_name || 'General Artemio Ricarte Memorial School'}
                </h1>
                <p className="hero-subtitle">
                  {info?.motto || 'Empowering Artemians with Quality, Excellence, Service, and Resilience'}
                </p>
                <div className="hero-actions">
                  <Link to="/admissions" className="btn btn-primary btn-lg">
                    Enroll Now
                    <ArrowRightIcon className="btn-icon" />
                  </Link>
                  <Link to="/about" className="btn btn-outline-light btn-lg">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Fallback when no general banner is set */
          <div className="hero-banner-fallback" aria-hidden="true">
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
                <span className="hero-eyebrow">
                  <SparkleIcon className="hero-eyebrow-icon" />
                  Welcome to GARMS
                </span>
                <h1 className="hero-title">
                  {info?.school_name || 'General Artemio Ricarte Memorial School'}
                </h1>
                <p className="hero-subtitle">
                  {info?.motto || 'Empowering Artemians with Quality, Excellence, Service, and Resilience'}
                </p>
                <div className="hero-actions">
                  <Link to="/admissions" className="btn btn-primary btn-lg">
                    Enroll Now
                    <ArrowRightIcon className="btn-icon" />
                  </Link>
                  <Link to="/about" className="btn btn-outline-light btn-lg">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={`navbar${scrolled ? ' navbar-sticky' : ''}`} ref={dropdownRef}>
        <div className="container nav-inner">
          <div className={`nav-menu${menuOpen ? ' open' : ''}`}>
            {NAV_ITEMS.map((item) => (
              item.children ? (
                <div
                  key={item.label}
                  className="nav-item mobile-parent"
                >
                  <button
                    className={`nav-link mobile-trigger${
                      location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                        ? ' active'
                        : ''
                    }`}
                    onClick={() => toggleMobileDropdown(item.label)}
                    aria-haspopup="true"
                    aria-expanded={mobileDropdown === item.label ? "true" : "false"}
                  >
                    <span className="nav-link-text">{item.label}</span>
                    <ChevronDownIcon className={`nav-caret${mobileDropdown === item.label ? ' open' : ''}`} />
                  </button>
                  <div className={`nav-dropdown${mobileDropdown === item.label ? ' visible' : ''}`}>
                    <div className="dropdown-content">
                      {item.children.map((child, idx) => (
                        <Link
                          key={child.label}
                          to={child.path}
                          className={`dropdown-item${idx === 0 ? ' first' : ''}`}
                          onClick={toggleMenu}
                        >
                          <span className="dropdown-dot" />
                          <span className="dropdown-label">{child.label}</span>
                          <ArrowRightIcon className="dropdown-arrow" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div key={item.label} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link${
                      location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                        ? ' active'
                        : ''
                    }`}
                    onClick={toggleMenu}
                  >
                    <span className="nav-link-text">{item.label}</span>
                  </Link>
                </div>
              )
            ))}
          </div>

          <div className="nav-actions">
            <button
              className={`hamburger${menuOpen ? ' open' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && <div className="mobile-menu-overlay" onClick={toggleMenu} />}
    </>
  );
}
