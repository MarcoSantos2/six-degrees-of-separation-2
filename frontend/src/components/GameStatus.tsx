import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import './styles.css';

const GameStatus: React.FC = () => {
  const { state } = useGame();
  const { currentPath, maxHops, targetActor, gameStatus } = state;
  const [isPathExpanded, setIsPathExpanded] = useState(true);

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
    return 'https://placehold.co/200x300?text=No+Poster';
  };

  return (
    <div className="game-status">
      <div className="target-actor-section">
        <div className="target-actor-card">
          <img 
            src={getActorImageUrl(targetActor)}
            alt={targetActor.name}
            className="target-actor-image"
          />
          <div className="target-actor-info">
            <h3>Target Actor</h3>
            <div className="highlight">{targetActor.name}</div>
          </div>
        </div>
        {gameStatus === 'in_progress' && (
          <div className="moves-remaining">
            <span className="highlight">{hopsRemaining}</span> moves remaining
          </div>
        )}
      </div>

      <div className="path-section">
        <div className="path-header" onClick={togglePath}>
          <h3>Your Path</h3>
          <button className="toggle-path-btn">
            {isPathExpanded ? '▼' : '▶'}
          </button>
        </div>
        
        {isPathExpanded && (
          <div className="interactive-path">
            {currentPath.map((step, index) => (
              <div key={index} className="path-step">
                <div className="path-actor-card">
                  <img 
                    src={getActorImageUrl(step.actor)}
                    alt={step.actor.name}
                    className="path-actor-image"
                  />
                  <div className="path-actor-name">{step.actor.name}</div>
                </div>
                
                {step.movie && (
                  <>
                    <div className="path-arrow">→</div>
                    <div className="path-movie-card">
                      <img 
                        src={getMoviePosterUrl(step.movie)}
                        alt={step.movie.title}
                        className="path-movie-image"
                      />
                      <div className="path-movie-title">{step.movie.title}</div>
                    </div>
                    <div className="path-arrow">→</div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {gameStatus === 'won' && (
        <div className="win-message">
          Congratulations! You've reached {targetActor.name} in {hopsMade} moves!
        </div>
      )}
      {gameStatus === 'lost' && (
        <div className="lose-message">
          Game Over! You've used all {maxHops} moves without reaching {targetActor.name}.
        </div>
      )}
    </div>
  );
};

export default GameStatus; 