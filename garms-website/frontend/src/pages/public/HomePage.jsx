import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl, formatDateShort } from '../../utils/helpers';
import './HomePage.css';

/* ================================================================
   Enhanced Icon Set — Professional SVG Icons
   All icons are carefully crafted for clarity and visual hierarchy
   ================================================================ */
const Icon = {
  Admissions: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6M9 9h1" />
    </svg>
  ),
  Faculty: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Resources: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M9 7h7M9 11h7" />
    </svg>
  ),
  Calendar: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  Issuances: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  ),
  Contact: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Vision: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Mission: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  ArrowRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  ChevronDown: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  Quote: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
    </svg>
  ),
  CheckCircle: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4l-8.97 8.97" />
    </svg>
  ),
  Users: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Award: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="8" r="7" />
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.11" />
    </svg>
  ),
  Heart: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Leaf: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3 2 4h-2c0 1 0 2-1 2-1.14 0-2.25.19-3.27.53C14 10.3 12.04 13.9 12 18c0 1 0 1.5-.5 2-.16.17-.33.34-.5.5Z" />
      <path d="M7 20c0-3 2-5 5-5" />
      <path d="M7 20H5" />
    </svg>
  ),
  Flag: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
  Enrollment: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M16 11l2 2 4-4" />
    </svg>
  ),
  Sparkle: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2l1.8 5.7L19.5 9.5l-5.7 1.8L12 17l-1.8-5.7L4.5 9.5l5.7-1.8z" />
    </svg>
  ),
};

/* ================================================================
   Scroll-reveal hook — adds a class once a section enters view
   ================================================================ */
function useReveal() {
  const ref = React.useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const [ref, visible] = useReveal();
  return (
    <Tag ref={ref} className={`${className} reveal${visible ? ' is-visible' : ''}`} {...rest}>
      {children}
    </Tag>
  );
}

/* ================================================================
   Utility function to safely parse and format dates
   ================================================================ */
function formatEventDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date;
  } catch {
    return null;
  }
}

export default function HomePage() {
  const [info, setInfo] = useState(null);
  const [content, setContent] = useState({});
  const [faqs, setFaqs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollStat, setEnrollStat] = useState(null);

  useEffect(() => {
    Promise.allSettled([
      api.get('/school-info').then(r => setInfo(r.data)),
      api.get('/content/about').then(r => {
        const map = {};
        r.data.forEach(b => { map[b.section_key] = b; });
        setContent(map);
      }),
      api.get('/faqs').then(r => setFaqs(r.data.slice(0, 4))),
      api.get('/calendar').then(r => setEvents(r.data.slice(0, 5))),
    ]).finally(() => setLoading(false));
    // Non-critical: fetch latest enrollment total for stats bar
    api.get('/enrollment-stats').then(r => {
      if (r.data && r.data.length) setEnrollStat(r.data[0]); // newest first (sort_order DESC)
    }).catch(() => {});
  }, []);

  const quickLinks = [
    { Icon: Icon.Admissions, label: 'Admissions', desc: 'See enrollment requirements, deadlines, and how to apply for the coming school year.', path: '/admissions', color: 'accent-red', badge: 'Start here' },
    { Icon: Icon.Faculty, label: 'Faculty & Staff', desc: 'Meet our dedicated teachers', path: '/faculty-staff', color: 'accent-blue' },
    { Icon: Icon.Resources, label: 'Learning Resources', desc: 'ARAL and supplementary materials', path: '/learning-resources', color: 'accent-green' },
    { Icon: Icon.Calendar, label: 'School Calendar', desc: 'Important dates and events', path: '/school-calendar', color: 'accent-purple' },
    { Icon: Icon.Issuances, label: 'Issuances', desc: 'DepEd orders, memos and notices', path: '/issuances', color: 'accent-orange' },
    { Icon: Icon.Contact, label: 'Contact Us', desc: 'Get in touch with our school', path: '/contact', color: 'accent-teal' },
  ];

  const stats = [
    { num: '1894', label: 'Year Established', icon: Icon.Award },
    { num: 'K–6', label: 'Grade Levels', icon: Icon.CheckCircle },
    { num: '1:35', label: 'Teacher–Pupil Ratio', icon: Icon.Users },
    { num: '35+', label: 'Teaching Personnel', icon: Icon.Users },
    {
      num: enrollStat ? Number(enrollStat.grand_total).toLocaleString() : '—',
      label: enrollStat ? `Enrolled (SY ${enrollStat.school_year})` : 'Total Enrolled',
      icon: Icon.Enrollment,
    },
  ];

  const coreValues = [
    {
      title: "Maka-Diyos",
      icon: Icon.Heart,
      description: "The school fosters respect for faith and spirituality by integrating moral and ethical lessons into daily learning.",
      colorClass: "val-blue"
    },
    {
      title: "Maka-Tao",
      icon: Icon.Users,
      description: "Students are taught empathy, kindness, and the fundamental importance of human dignity in all interactions.",
      colorClass: "val-rose"
    },
    {
      title: "Makakalikasan",
      icon: Icon.Leaf,
      description: "GARMS supports environmental protection through clean-up drives, waste segregation, and greening programs.",
      colorClass: "val-emerald"
    },
    {
      title: "Makabansa",
      icon: Icon.Flag,
      description: "Patriotism is cultivated through civic activities, history lessons, and events that honor national heroes.",
      colorClass: "val-amber"
    }
  ];

  // Filter events with valid dates
  const validEvents = events.filter(event => formatEventDate(event.date));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="homepage">
      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="container stats-grid">
          {stats.map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-icon-wrap">
                <s.icon className="stat-icon" />
              </div>
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links Section — bento layout, Admissions featured */}
      <section className="section quick-links-section">
        <div className="container">
          <Reveal as="div" className="text-center section-head">
            <p className="section-eyebrow">Find your way around</p>
            <h2 className="section-title">Explore <span className="accent-text">GARMS</span></h2>
          </Reveal>
          <div className="quick-links-grid">
            {quickLinks.map((l, idx) => (
              <Reveal
                as={Link}
                to={l.path}
                key={l.label}
                className={`quick-link-card ${l.color}${idx === 0 ? ' featured' : ''}`}
                style={{ transitionDelay: `${idx * 60}ms` }}
              >
                {l.badge && <span className="ql-badge">{l.badge}</span>}
                <span className="ql-icon-wrap">
                  <l.Icon className="ql-icon" />
                </span>
                <div className="ql-body">
                  <div className="ql-label">{l.label}</div>
                  <div className="ql-desc">{l.desc}</div>
                </div>
                <Icon.ArrowRight className="ql-arrow" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="section vm-section">
        <div className="container">
          <Reveal as="div" className="text-center section-head">
            <p className="section-eyebrow">Who we are</p>
            <h2 className="section-title">Vision &amp; <span className="accent-text">Mission</span></h2>
          </Reveal>

          <div className="vm-grid">
            <Reveal className="vm-card vm-vision">
              <Icon.Quote className="vm-quote-mark" />
              <div className="vm-icon-wrap">
                <Icon.Vision className="vm-icon" />
              </div>
              <h3>Our Vision</h3>
              <span className="vm-divider" />
              <div
                className="rich-content"
                dangerouslySetInnerHTML={{
                  __html:
                    content.vision?.body_richtext ||
                    '<p>We dream of Filipinos who passionately love their country and whose values and competencies enable them to realize their full potential and contribute meaningfully to building the nation.</p>',
                }}
              />
            </Reveal>

            <Reveal className="vm-card vm-mission" style={{ transitionDelay: '90ms' }}>
              <Icon.Quote className="vm-quote-mark" />
              <div className="vm-icon-wrap">
                <Icon.Mission className="vm-icon" />
              </div>
              <h3>Our Mission</h3>
              <span className="vm-divider" />
              <div
                className="rich-content"
                dangerouslySetInnerHTML={{
                  __html:
                    content.mission?.body_richtext ||
                    '<p>To provide quality, accessible, and relevant basic education to all Filipinos using flexible and alternative delivery modes to develop their potential as individuals and as members of the community and nation.</p>',
                }}
              />
            </Reveal>
          </div>

          {/* Core Values */}
          <Reveal className="core-values-section">
            <div className="core-values-header">
              <p className="section-eyebrow">What guides us</p>
              <h3 className="core-values-title">Core <span className="accent-text">Values</span></h3>
              <p className="core-values-subtitle">
                GARMS instills these core values through daily classroom interactions, co-curricular activities, flag ceremonies, and community outreach.
              </p>
            </div>

            <div className="core-values-grid">
              {coreValues.map((val, idx) => (
                <div key={idx} className={`core-value-card ${val.colorClass}`}>
                  <div className="cv-icon-box">
                    <val.icon className="cv-icon" />
                  </div>
                  <h4 className="cv-name">{val.title}</h4>
                  <p className="cv-desc">{val.description}</p>
                  <div className="cv-card-pattern"></div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Principal's Message Section */}
      {content.principal?.body_richtext && (
        <section className="section principal-section">
          <div className="container">
            <Reveal className="principal-card">
              {info?.principal_photo_url && (
                <div className="principal-photo-wrap">
                  <img
                    src={getImageUrl(info.principal_photo_url)}
                    alt={info.principal_name || 'School Principal'}
                    className="principal-photo"
                  />
                </div>
              )}
              <div className="principal-text">
                <Icon.Quote className="principal-quote-icon" />
                <div className="principal-badge">Principal's Message</div>
                <h2>{info?.principal_name || 'School Principal'}</h2>
                <div
                  className="principal-message rich-content"
                  dangerouslySetInnerHTML={{ __html: content.principal.body_richtext }}
                />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Events Section — vertical timeline */}
      {validEvents.length > 0 && (
        <section className="section events-section">
          <div className="container">
            <Reveal as="div" className="section-head">
              <p className="section-eyebrow">Calendar</p>
              <h2 className="section-title">Upcoming <span className="accent-text">Events</span></h2>
              <p className="section-subtitle">Mark your calendars for important school activities</p>
            </Reveal>
            <div className="events-timeline">
              {validEvents.map((event, idx) => {
                const eventDate = formatEventDate(event.date);
                if (!eventDate) return null;

                const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
                const day = eventDate.getDate();
                const isSoonest = idx === 0 && eventDate >= today;

                return (
                  <Reveal
                    key={event.id}
                    className={`event-item${isSoonest ? ' is-next' : ''}`}
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    <div className="event-date-box">
                      <div className="event-month">{month}</div>
                      <div className="event-day">{day}</div>
                    </div>
                    <div className="event-node" aria-hidden="true" />
                    <div className="event-details">
                      <div className="event-name">
                        {event.title}
                        {isSoonest && <span className="event-tag">Up next</span>}
                      </div>
                      <div className="event-range">
                        <Icon.Calendar className="event-icon" />
                        {formatDateShort(event.date) || event.date}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Call-to-Action Section */}
      <section className="section cta-section">
        <div className="cta-pattern" aria-hidden="true" />
        <div className="container">
          <div className="cta-inner">
            <div className="cta-text">
              <span className="cta-eyebrow"><Icon.Sparkle className="cta-eyebrow-icon" /> Admissions open</span>
              <h2>Ready to Join GARMS?</h2>
              <p>Start your journey towards academic excellence and personal growth with our dedicated faculty and comprehensive learning programs.</p>
            </div>
            <div className="cta-actions">
              <Link to="/admissions" className="btn btn-primary btn-lg">
                Apply Now <Icon.ArrowRight className="btn-icon" />
              </Link>
              <Link to="/contact" className="btn btn-outline cta-contact-btn btn-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}