import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTargetActor } from '../services/api';
import { useGame } from '../context/GameContext';
import './styles.css';

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setTargetActor, state } = useGame();
  const navigate = useNavigate();

  // Using a ref to prevent duplicate fetches
  const fetchedRef = React.useRef(false);

  useEffect(() => {
    // Only fetch if we haven't already fetched and don't have a target actor
    if (!fetchedRef.current && !state.targetActor) {
      const fetchTargetActor = async () => {
        try {
          setLoading(true);
          const actor = await getTargetActor();
          setTargetActor(actor);
          setLoading(false);
          fetchedRef.current = true;
        } catch (err) {
          console.error('Error in fetchTargetActor:', err);
          setError('Failed to fetch target actor. Please try again later.');
          setLoading(false);
        }
      };

      fetchTargetActor();
    } else if (state.targetActor) {
      // If we already have a target actor, just update loading state
      setLoading(false);
      fetchedRef.current = true;
    }
  }, []); // Empty dependency array - only run once on mount

  const handleStartGame = () => {
    navigate('/start');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Check if targetActor exists before rendering
  if (!state.targetActor) {
    return <div className="loading">Waiting for target actor data...</div>;
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

      <button className="start-game-button" onClick={handleStartGame}>
        Start Game
      </button>
    </div>
  );
};

export default HomePage; 