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
    console.log('HomePage useEffect - Current state:', {
      fetchedRef: fetchedRef.current,
      hasTargetActor: !!state.targetActor,
      loading
    });

    // Only fetch if we haven't already fetched and don't have a target actor
    if (!fetchedRef.current && !state.targetActor) {
      const fetchTargetActor = async () => {
        try {
          console.log('Starting target actor fetch...');
          setLoading(true);
          const actor = await getTargetActor();
          console.log('Target actor received:', actor);
          setTargetActor(actor);
          setLoading(false);
          fetchedRef.current = true;
          console.log('Target actor fetch completed');
        } catch (err) {
          console.error('Error in fetchTargetActor:', err);
          setError('Failed to fetch target actor. Please try again later.');
          setLoading(false);
          fetchedRef.current = true;
        }
      };

      fetchTargetActor();
    } else if (state.targetActor) {
      console.log('Using existing target actor:', state.targetActor);
      setLoading(false);
      fetchedRef.current = true;
    }
  }, [state.targetActor, setTargetActor]); // Added dependencies

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
        <p
          style={{
            color: (document.documentElement.getAttribute('data-theme') === 'dark') ? '#000' : 'var(--text-main)'
          }}
        >
          Connect from any starting actor to the target actor in 6 or fewer hops.
          Select a movie, then an actor from that movie, then another movie that actor appears in, and so on.
        </p>
        <p
          style={{
            color: (document.documentElement.getAttribute('data-theme') === 'dark') ? '#000' : 'var(--text-main)'
          }}
        >
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