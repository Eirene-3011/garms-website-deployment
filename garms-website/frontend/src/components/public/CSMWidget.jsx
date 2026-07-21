import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';

const SESSION_KEY = 'garms_csm_dismissed';

/**
 * Floating Client Satisfaction Survey widget.
 * Appears on first load each session, collapses to a small button,
 * or dismisses for the session (reappears on next visit).
 */
export default function CSMWidget() {
  const [state, setState] = useState('loading'); // 'loading' | 'expanded' | 'minimized' | 'closed'
  const [link, setLink] = useState(null);
  const [qrImage, setQrImage] = useState(null);

  useEffect(() => {
    // If already dismissed this session, don't show
    if (sessionStorage.getItem(SESSION_KEY)) {
      setState('closed');
      return;
    }
    api.get('/feedback').then(r => {
      const items = r.data || [];
      const survey = items.find(i => i.type === 'csm_survey');
      const qr = items.find(i => i.type === 'qr_code_image');
      if (survey) setLink(survey);
      if (qr) setQrImage(qr);
      if (survey || qr) setState('expanded');
      else setState('closed');
    }).catch(() => setState('closed'));
  }, []);

  const handleMinimize = () => setState('minimized');
  const handleClose = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setState('closed');
  };
  const handleExpand = () => setState('expanded');

  if (state === 'loading' || state === 'closed') return null;

  return (
    <>
      {state === 'minimized' && (
        <button
          onClick={handleExpand}
          aria-label="Open Client Satisfaction Survey"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9000,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--red-primary)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: '#fff',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          title="Client Satisfaction Survey"
        >
          📋
        </button>
      )}

      {state === 'expanded' && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Client Satisfaction Survey"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9000,
            width: 300,
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            border: '1px solid rgba(0,0,0,0.08)',
            overflow: 'hidden',
            animation: 'csmSlideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Header */}
          <div style={{
            background: 'var(--red-primary)',
            color: '#fff',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              📋 Client Satisfaction Survey
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={handleMinimize}
                aria-label="Minimize"
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: '0 4px', opacity: 0.85 }}
                title="Minimize"
              >—</button>
              <button
                onClick={handleClose}
                aria-label="Close"
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1, padding: '0 4px', opacity: 0.85 }}
                title="Dismiss for this visit"
              >✕</button>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: 16 }}>
            <p style={{
              fontSize: '0.82rem',
              color: 'var(--gray-600)',
              marginBottom: 14,
              lineHeight: 1.5,
              textAlign: 'left',
            }}>
              Help us improve our services by completing our Client Satisfaction Survey. Your feedback matters!
            </p>

            {qrImage && (
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <img
                  src={getImageUrl(qrImage.url)}
                  alt="Survey QR Code"
                  style={{ width: 140, height: 140, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--gray-200)' }}
                  onError={e => e.target.style.display = 'none'}
                />
                <p style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: 6 }}>Scan QR code to open survey</p>
              </div>
            )}

            {link && (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  background: 'var(--red-primary)',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '10px 16px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dark)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--red-primary)'}
              >
                Take the Survey →
              </a>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes csmSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
