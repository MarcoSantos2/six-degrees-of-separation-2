import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useToast } from './ToastProvider';
import Timer from './Timer';
import './styles.css';

const GameStatus: React.FC = () => {
  const { state } = useGame();
  const { currentPath, targetActor, gameStatus } = state;
  const [isPathExpanded, setIsPathExpanded] = useState(true);
  const { showToast } = useToast();
  const hasShownWinToast = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (gameStatus === 'won' && !hasShownWinToast.current) {
      showToast('Congratulations, you won!', 'success');
      hasShownWinToast.current = true;
    }
    if (gameStatus !== 'won') {
      hasShownWinToast.current = false;
    }
  }, [gameStatus, showToast]);

  // Add effect to handle game over conditions
  useEffect(() => {
    if (gameStatus === 'lost' || gameStatus === 'won') {
      navigate('/end');
    }
  }, [gameStatus, navigate]);

  if (!targetActor) {
    return null;
  }

  // Calculate hops made and remaining
  const totalActors = currentPath.filter(item => item.actor).length;
  const hopsMade = totalActors; // Each actor selection counts as a move
  const hopsRemaining = state.settings.maxHopsEnabled ? state.settings.maxHops - hopsMade : '∞';

  const togglePath = () => {
    setIsPathExpanded(!isPathExpanded);
  };

  const getActorImageUrl = (actor: typeof targetActor) => {
    if (actor.profile_path) {
      return `https://image.tmdb.org/t/p/w200${actor.profile_path}`;
    }
    return 'https://placehold.co/200x300?text=No+Image';
  };

  const getMoviePosterUrl = (movie: { poster_path: string | null }) => {
    if (movie?.poster_path) {
      return `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
    }
    return 'https://placehold.co/200x300?text=No+Image';
  };

  return (
    <>
      <div className="target-actor-section" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.5em',
        position: 'sticky',
        top: '1em',
        backgroundColor: 'var(--bg-panel)',
        zIndex: 3,
        padding: '1em',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '1.5em',
        width: '731.99px',
        margin: '0 auto'
      }}>
        <div className="target-actor-card" style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
          <img 
            src={getActorImageUrl(targetActor)}
            alt={targetActor.name}
            className="target-actor-image"
            style={{ width: 60, height: 90, borderRadius: 8, objectFit: 'cover', background: '#eee', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
          />
          <div className="target-actor-info">
            <h3 style={{ margin: 0, color: 'var(--color-cinema-red)', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.04em' }}>Target Actor</h3>
            <div className="highlight" style={{ color: 'var(--color-midnight-black)', fontWeight: 700, fontSize: '1.1rem' }}>{targetActor.name}</div>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1em' }}>
          {state.settings.maxHopsEnabled && (
            <div className="moves-remaining" style={{ color: 'var(--color-cinema-red)', fontWeight: 700, fontSize: '1.1rem' }}>
              <span className="highlight">{hopsRemaining}</span> moves remaining
            </div>
          )}
          {state.settings.timerEnabled && state.timer.remainingTime > 0 && <Timer />}
        </div>
      </div>

      <div>
        <div className="game-status panel" style={{ padding: '1.5em', borderRadius: 12 }}>
      {gameStatus === 'in_progress' && (
        <div style={{ width: '731.99px', margin: '0 auto' }}>
          <div className="path-section" style={{ marginTop: 16 }}>
            <div className="path-header" onClick={togglePath} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
              <h3 style={{ margin: 0, color: 'black', fontWeight: 700, fontSize: '1.1rem' }}>Your Path</h3>
              <button className="toggle-path-btn" style={{ background: 'none', border: 'none', color: 'var(--color-cinema-red)', fontSize: '1.1rem', cursor: 'pointer' }}>
                {isPathExpanded ? '▼' : '▶'}
              </button>
            </div>
            {isPathExpanded && (
              <div className="interactive-path" style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto', whiteSpace: 'nowrap', marginTop: 12 }}>
                {currentPath.map((step, index) => (
                  <div key={index} className="path-step" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="path-actor-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 100, padding: 10, borderRadius: 8, background: '#fff', boxShadow: '#00000050 1px 4px 8px' }}>
                      <img 
                        src={getActorImageUrl(step.actor)}
                        alt={step.actor.name}
                        className="path-actor-image"
                        style={{ width: 56, height: 84, borderRadius: 8, objectFit: 'cover', background: '#eee' }}
                      />
                      <div className="path-actor-name" style={{ color: 'var(--color-midnight-black)', fontWeight: 600, fontSize: '1.05rem', textAlign: 'center', maxWidth: 90, whiteSpace: 'normal', wordBreak: 'break-word' }}>{step.actor.name}</div>
                      {step.media && (
                        <div className="path-movie-title" style={{ color: '#666666', fontWeight: 500, fontSize: '0.6875rem', textAlign: 'center', maxWidth: 90, whiteSpace: 'normal', wordBreak: 'break-word', marginTop: 2 }}>
                          {step.media.media_type === 'movie' ? step.media.title : step.media.name}
                        </div>
                      )}
                    </div>
                    {index < currentPath.length - 1 && (
                      <div className="path-arrow" style={{ color: 'var(--color-cinema-red)', fontSize: '1.5em', margin: '0 4px' }}>→</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
      </div>
    </>
  );
};

export default GameStatus; 