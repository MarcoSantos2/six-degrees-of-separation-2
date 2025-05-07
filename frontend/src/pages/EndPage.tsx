import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import './styles.css';
import ConnectednessWord from '../components/ConnectednessWord';

const EndPage: React.FC = () => {
  const { state, resetGame } = useGame();
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    resetGame();
    navigate('/start');
  };

  if (!state.targetActor) {
    navigate('/');
    return null;
  }

  // Calculate hops properly based on actor count
  const totalActors = state.currentPath.filter(item => item.actor).length;
  const hopsMade = totalActors > 0 ? totalActors - 1 : 0;

  return (
    <div className="end-page panel" style={{ maxWidth: 900, margin: '2em auto', position: 'relative' }}>
      {state.gameStatus !== 'won' && (
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5em', textAlign: 'center', letterSpacing: '0.08em' }}>Game Over</h1>
      )}
      <div className="game-summary" style={{ background: 'var(--bg-panel)', borderRadius: 12, margin: '2em auto', padding: '2em', maxWidth: 600 }}>
        <h2 style={{ textAlign: 'center', color: state.gameStatus === 'won' ? '#111' : 'var(--color-cinema-red)', fontWeight: 700, fontSize: '1.5rem', marginBottom: '1em' }}>
          {state.gameStatus === 'won' ? 'Congratulations!' : 'Better luck next time!'}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '2em' }}>
          {state.gameStatus === 'won' 
            ? `You connected to ${state.targetActor.name} in ${hopsMade + 1} moves.` 
            : `You didn't reach ${state.targetActor.name} within ${state.maxHops} moves.`}
        </p>
        <div className="path-summary" style={{ marginTop: 20 }}>
          <h3 style={{ color: 'var(--color-cinema-red)', fontWeight: 700, fontSize: '1.2rem' }}>Your Path:</h3>
          <ul className="path-list">
            {state.currentPath.map((step, index) => (
              <li key={index}>
                {index > 0 && <div className="path-arrow">↓</div>}
                {step.actor && (
                  <div className="path-actor" style={{ color: 'var(--color-midnight-black)', fontWeight: 'bold' }}>{step.actor.name}</div>
                )}
                {step.media && (
                  <div className="path-movie" style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginLeft: 20 }}>in "{step.media.title}"</div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5em', marginTop: '2em' }}>
          <button className="btn" style={{ background: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', fontWeight: 700, fontSize: '1.1rem' }} onClick={handlePlayAgain}>Play Again</button>
          <button className="btn" style={{ background: 'var(--button-secondary-bg)', color: 'var(--button-secondary-text)', fontWeight: 700, fontSize: '1.1rem' }} disabled>See Leaderboard (coming soon)</button>
        </div>
        {state.gameStatus === 'won' && <ConnectednessWord />}
      </div>
    </div>
  );
};

export default EndPage; 