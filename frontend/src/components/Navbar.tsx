import React, { useEffect, useState } from 'react';
import './styles.css';
import { Link } from 'react-router-dom';

const LOGO_PATH = '/logos/logo.png';

const Navbar: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <nav className="navbar" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.5em 2em',
      background: 'var(--bg-panel)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1em', textDecoration: 'none' }}>
        <img src={LOGO_PATH} alt="App Logo" style={{ height: 40, width: 40, borderRadius: 8, background: 'var(--color-white-frame)' }} />
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2rem',
          letterSpacing: '0.08em',
          color: 'var(--text-main)',
          textTransform: 'uppercase',
          fontWeight: 700
        }}>
          6 Degrees of Separation
        </span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5em' }}>
        <button
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setDarkMode(dm => !dm)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            color: 'var(--text-main)',
            marginRight: '0.5em',
            display: 'flex',
            alignItems: 'center',
            padding: 0
          }}
        >
          {darkMode ? (
            // Moon icon
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" /></svg>
          ) : (
            // Sun icon
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95-1.41-1.41M6.46 6.46 5.05 5.05m12.02 0-1.41 1.41M6.46 17.54l-1.41 1.41" /></svg>
          )}
        </button>
        <button className="btn" style={{ fontSize: '1rem', padding: '0.5em 1.2em' }}>
          Profile / Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 