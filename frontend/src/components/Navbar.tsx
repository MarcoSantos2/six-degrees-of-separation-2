import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SettingsModal from './SettingsModal';
import { useGame } from '../context/GameContext';
import './Navbar.css';

const LOGO_PATH = '/logos/logo2-nobg.png';

const Navbar: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { resetGame } = useGame();

  const handleRestart = () => {
    resetGame();
    navigate('/');
  };

  // Don't show restart button on end page
  const showRestartButton = location.pathname !== '/end';

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
        <img src={LOGO_PATH} alt="App Logo" style={{ height: 40, width: 40, borderRadius: 8, background: 'var(--color-white-frame)' }} />
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2rem',
          letterSpacing: '0.08em',
          color: 'var(--text-main)',
          textTransform: 'uppercase',
          fontWeight: 700
        }}>
          Degrees of Separation
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
        {showRestartButton && (
          <button 
            className="icon-button"
            onClick={handleRestart}
            aria-label="Restart Game"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              padding: 0
            }}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
          </button>
        )}
        <button 
          className="icon-button"
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Open Settings"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            padding: 0
          }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      </div>
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </nav>
  );
};

export default Navbar; 