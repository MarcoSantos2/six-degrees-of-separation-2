import React from 'react';
import { useGame } from '../context/GameContext';

const Timer: React.FC = () => {
  const { state } = useGame();
  const { remainingTime } = state.timer;

  if (!state.settings.timerEnabled || !state.timer.isRunning) {
    return null;
  }

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5em',
      padding: '0.5em 1em',
      borderRadius: '20px',
      background: remainingTime <= 60 ? 'var(--color-cinema-red)' : 'var(--bg-panel)',
      color: remainingTime <= 60 ? 'white' : 'var(--text-main)',
      fontWeight: 700,
      fontSize: '1.1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease'
    }}>
      <span>⏱️</span>
      <span>{`${minutes}:${seconds.toString().padStart(2, '0')}`}</span>
    </div>
  );
};

export default Timer; 