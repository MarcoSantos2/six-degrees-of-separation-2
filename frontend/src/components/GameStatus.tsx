import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useToast } from './ToastProvider';
import './styles.css';

const GameStatus: React.FC = () => {
  const { state } = useGame();
  const { currentPath, maxHops, targetActor, gameStatus } = state;
  const [isPathExpanded, setIsPathExpanded] = useState(true);
  const { showToast } = useToast();
  const hasShownWinToast = useRef(false);

  useEffect(() => {
    if (gameStatus === 'won' && !hasShownWinToast.current) {
      showToast('Congratulations, you won!', 'success');
      hasShownWinToast.current = true;
    }
    if (gameStatus !== 'won') {
      hasShownWinToast.current = false;
    }
  }, [gameStatus, showToast]);

  if (!targetActor || gameStatus === 'not_started') {
    return null;
  }

  // Calculate hops made and remaining
  const totalActors = currentPath.filter(item => item.actor).length;
  const hopsMade = totalActors > 0 ? totalActors - 1 : 0;
  const hopsRemaining = maxHops - hopsMade - 1;

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
    <div className="game-status panel" style={{ margin: '1.5em auto', maxWidth: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '1.5em', borderRadius: 12 }}>
      <div className="target-actor-section" style={{ display: 'flex', alignItems: 'center', gap: '1.5em', marginBottom: '1em' }}>
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
        {gameStatus === 'in_progress' && (
          <div className="moves-remaining" style={{ marginLeft: 'auto', color: 'var(--color-cinema-red)', fontWeight: 700, fontSize: '1.1rem' }}>
            <span className="highlight">{hopsRemaining}</span> moves remaining
          </div>
        )}
      </div>
      <div className="path-section" style={{ marginTop: 16 }}>
        <div className="path-header" onClick={togglePath} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
          <h3 style={{ margin: 0, color: 'var(--color-cinema-red)', fontWeight: 700, fontSize: '1.1rem' }}>Your Path</h3>
          <button className="toggle-path-btn" style={{ background: 'none', border: 'none', color: 'var(--color-cinema-red)', fontSize: '1.1rem', cursor: 'pointer' }}>
            {isPathExpanded ? '▼' : '▶'}
          </button>
        </div>
        {isPathExpanded && (
          <div className="interactive-path" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 12 }}>
            {currentPath.map((step, index) => (
              <div key={index} className="path-step" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="path-actor-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <img 
                    src={getActorImageUrl(step.actor)}
                    alt={step.actor.name}
                    className="path-actor-image"
                    style={{ width: 40, height: 60, borderRadius: 6, objectFit: 'cover', background: '#eee' }}
                  />
                  <div className="path-actor-name" style={{ color: 'var(--color-midnight-black)', fontWeight: 600, fontSize: '0.95rem', textAlign: 'center' }}>{step.actor.name}</div>
                </div>
                {step.movie && (
                  <>
                    <div className="path-arrow" style={{ color: 'var(--color-cinema-red)', fontSize: '1.5em', margin: '0 4px' }}>→</div>
                    <div className="path-movie-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <img 
                        src={getMoviePosterUrl(step.movie)}
                        alt={step.movie.title}
                        className="path-movie-image"
                        style={{ width: 40, height: 60, borderRadius: 6, objectFit: 'cover', background: '#eee' }}
                      />
                      <div className="path-movie-title" style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.92rem', textAlign: 'center' }}>{step.movie.title}</div>
                    </div>
                    <div className="path-arrow" style={{ color: 'var(--color-cinema-red)', fontSize: '1.5em', margin: '0 4px' }}>→</div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {gameStatus === 'won' && (
        <div className="win-message" style={{ color: 'var(--color-spotlight-gold)', fontWeight: 700, fontSize: '1.2rem', textAlign: 'center', marginTop: 20 }}>
          Congratulations! You've reached {targetActor.name} in {hopsMade + 1} moves!
        </div>
      )}
      {gameStatus === 'lost' && (
        <div className="lose-message" style={{ color: 'var(--color-cinema-red)', fontWeight: 700, fontSize: '1.2rem', textAlign: 'center', marginTop: 20 }}>
          Game Over! You've used all {maxHops} moves without reaching {targetActor.name}.
        </div>
      )}
    </div>
  );
};

export default GameStatus; 