import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTargetActor } from '../services/api';
import { Actor } from '../types';
import { useGame } from '../context/GameContext';
import ActorCard from '../components/ActorCard';
import './styles.css';

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setTargetActor, state } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTargetActor = async () => {
      try {
        setLoading(true);
        const actor = await getTargetActor();
        setTargetActor(actor);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch target actor. Please try again later.');
        setLoading(false);
      }
    };

    fetchTargetActor();
  }, [setTargetActor]);

  const handleStartGame = () => {
    navigate('/start');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-page">
      <h1>Six Degrees of Movie Separation</h1>
      <div className="game-intro">
        <p>
          Connect from any starting actor to the target actor in 6 or fewer hops.
          Select a movie, then an actor from that movie, then another movie that actor appears in, and so on.
        </p>
        <p>
          You win if you reach the target actor within 6 moves!
        </p>
      </div>

      <div className="target-actor-container">
        <h2>Your Target:</h2>
        {state.targetActor && <ActorCard actor={state.targetActor} />}
      </div>

      <button className="start-game-button" onClick={handleStartGame}>
        Start Game
      </button>
    </div>
  );
};

export default HomePage; 