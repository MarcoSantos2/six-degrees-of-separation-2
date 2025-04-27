import React from 'react';
import { useGame } from '../context/GameContext';
import './styles.css';

const GameStatus: React.FC = () => {
  const { state } = useGame();
  const { currentPath, maxHops, targetActor, gameStatus } = state;

  if (!targetActor || gameStatus === 'not_started') {
    return null;
  }

  // Calculate hops made and remaining
  // Count the number of actor selections (but first actor doesn't count as a hop)
  const totalActors = currentPath.filter(item => item.actor).length;
  const hopsMade = totalActors > 0 ? totalActors - 1 : 0;
  const hopsRemaining = maxHops - hopsMade;

  return (
    <div className="game-status">
      <h3>Game Status</h3>
      <div className="status-info">
        <div>Target Actor: <span className="highlight">{targetActor.name}</span></div>
        <div>Current Path:</div>
        <div className="path-display">
          {currentPath.map((step, index) => (
            <span key={index}>
              {index > 0 && ' → '}
              {step.actor.name}
              {step.movie && ` → ${step.movie.title}`}
            </span>
          ))}
        </div>
        {gameStatus === 'in_progress' && (
          <div>Remaining Moves: <span className="highlight">{hopsRemaining}</span></div>
        )}
        {gameStatus === 'won' && (
          <div className="win-message">Congratulations! You've reached {targetActor.name} in {hopsMade} moves!</div>
        )}
        {gameStatus === 'lost' && (
          <div className="lose-message">Game Over! You've used all {maxHops} moves without reaching {targetActor.name}.</div>
        )}
      </div>
    </div>
  );
};

export default GameStatus; 