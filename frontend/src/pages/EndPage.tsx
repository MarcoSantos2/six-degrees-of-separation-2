import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import GameStatus from '../components/GameStatus';
import './styles.css';

const EndPage: React.FC = () => {
  const { state, resetGame } = useGame();
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    resetGame();
    navigate('/start');
  };

  const handleNewGame = () => {
    resetGame();
    navigate('/');
  };

  if (!state.targetActor) {
    navigate('/');
    return null;
  }

  // Calculate hops properly based on actor count
  const totalActors = state.currentPath.filter(item => item.actor).length;
  const hopsMade = totalActors > 0 ? totalActors - 1 : 0;

  return (
    <div className="end-page">
      <h1>Game Over</h1>
      
      <GameStatus />
      
      <div className="game-summary">
        <h2>
          {state.gameStatus === 'won' ? 'Congratulations! You won!' : 'Better luck next time!'}
        </h2>
        <p>
          {state.gameStatus === 'won' 
            ? `You connected to ${state.targetActor.name} in ${hopsMade} moves.` 
            : `You didn't reach ${state.targetActor.name} within ${state.maxHops} moves.`}
        </p>
        
        <div className="path-summary">
          <h3>Your Path:</h3>
          <ul className="path-list">
            {state.currentPath.map((step, index) => (
              <li key={index}>
                {index > 0 && <div className="path-arrow">↓</div>}
                {step.actor && (
                  <div className="path-actor">{step.actor.name}</div>
                )}
                {step.movie && (
                  <div className="path-movie">in "{step.movie.title}"</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="button-container">
        <button className="play-again-button" onClick={handlePlayAgain}>
          Play Again (Same Target)
        </button>
        <button className="new-game-button" onClick={handleNewGame}>
          New Game (New Target)
        </button>
      </div>
    </div>
  );
};

export default EndPage; 