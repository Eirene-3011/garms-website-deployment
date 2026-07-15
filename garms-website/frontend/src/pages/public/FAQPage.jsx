import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { IconSearch, IconChevronDown, IconMessageSquare } from '../../components/Icons';

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/faqs').then(r => setFaqs(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = faqs.filter(f =>
    !search || f.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> › FAQ</div>
          <h1>Frequently Asked Questions</h1>
          <p>Answers to common questions about GARMS</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ marginBottom: 32 }}>
            <div className="search-input-wrap search-input-wrap-lg">
              <span className="search-input-icon" aria-hidden="true"><IconSearch size={16} /></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search questions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div className="card" key={i} style={{ padding: '18px 24px' }}>
                  <div className="skeleton" style={{ width: '70%', height: 14 }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" aria-hidden="true"><IconSearch size={22} /></div>
              <p>No FAQ entries found. {search && 'Try a different search term.'}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map((f, i) => (
                <details key={f.id} className="card faq-item">
                  <summary className="faq-summary">
                    <span className="faq-question">
                      <span className="faq-number" aria-hidden="true">{i + 1}</span>
                      {f.question}
                    </span>
                    <span className="faq-toggle" aria-hidden="true"><IconChevronDown size={15} /></span>
                  </summary>
                  <div className="faq-answer">
                    <div className="rich-content" dangerouslySetInnerHTML={{ __html: f.answer_richtext }} />
                  </div>
                </details>
              ))}
            </div>
          )}

          <div className="divider" />
          <div className="cta-panel">
            <div className="cta-panel-icon" aria-hidden="true"><IconMessageSquare size={20} /></div>
            <p>Didn't find your answer? Contact us directly.</p>
            <Link to="/contact" className="btn btn-primary">Contact the School</Link>
          </div>
        </div>
      </section>
    </div>
  );
}