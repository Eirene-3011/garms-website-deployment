import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSchoolInfo } from '../../hooks/useSchoolInfo';
import { getImageUrl } from '../../utils/helpers';
import './Header.css';

// Custom SVG Icons
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon">
    <path d="M20.01 15.38c-1.23 0-2.42-.18-3.53-.56-.35-.12-.74-.03-1.01.24l-2.17 2.17c-2.83-1.44-5.15-3.75-6.59-6.59l2.17-2.17c.27-.27.36-.66.24-1.01-.38-1.11-.56-2.3-.56-3.53 0-.55-.45-1-1-1H3.5c-.55 0-1 .45-1 1C2.5 13.91 10.09 21.5 19.5 21.5c.55 0 1-.45 1-1v-4.01c0-.55-.45-1-1-1z" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

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
  { label: 'Admissions', path: '/admissions' },
  { label: 'PPAs', path: '/ppas' },
  {
    label: "Students' Corner", path: '/students-corner',
    children: [
      { label: 'Commendations', path: '/students-corner?tab=commendation' },
      { label: 'Featured Student', path: '/students-corner?tab=featured_student' },
      { label: 'Accomplishments', path: '/students-corner?tab=accomplishment' },
    ]
  },
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
  { label: 'Faculty & Staff', path: '/faculty-staff' },
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false); // New state for search overlay
  const location = useLocation();
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false); // Close search when navigating
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

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (menuOpen) setMenuOpen(false); // Close mobile menu if search is opened
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (searchOpen) setSearchOpen(false); // Close search if mobile menu is opened
  };

  return (
    <>
      {/* Top bar */}
      <div className="header-topbar">
        <div className="container topbar-inner">
          <span className="topbar-item" aria-label="School Location"><LocationIcon /> Brgy. Bagumbayan, General Trias City, Cavite</span>
          <span className="topbar-item" aria-label="School Landline"><PhoneIcon /> {info?.landline || '(046) 472-5307'}</span>
          <span className="topbar-item" aria-label="School Email"><EmailIcon /> {info?.email || '107960@deped.gov.ph'}</span>
        </div>
      </div>

      {/* Brand bar */}
      <div className="header-brand">
        <div className="container brand-inner">
          <Link to="/" className="brand-logo" aria-label="Go to Home Page">
            <img src={getImageUrl(info?.logo_url) || '/uploads/logo.png'} alt="GARMS Logo" className="brand-img" onError={e => { e.target.style.display = 'none'; }} />
            <div className="brand-text">
              <span className="brand-name">General Artemio Ricarte Memorial School</span>
              <span className="brand-sub">School ID: 107960 | Division of General Trias City | Region IV-A CALABARZON</span>
            </div>
          </Link>
          <div className="brand-deped">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Department_of_Education_%28DepEd%29_of_the_Philippines.svg/200px-Department_of_Education_%28DepEd%29_of_the_Philippines.svg.png"
              alt="DepEd Logo" className="deped-logo" onError={e => e.target.style.display='none'} />
          </div>
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
                  onClick={() => item.children ? null : toggleMenu()} // Close menu on item click
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
            <button className="search-button" onClick={toggleSearch} aria-label="Search">
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
      {searchOpen && (
        <div className="search-overlay">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              ref={searchInputRef}
              aria-label="Search input field"
            />
            <button className="search-overlay-close" onClick={toggleSearch} aria-label="Close search">
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
