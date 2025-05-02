import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTargetActor } from '../services/api';
import { useGame } from '../context/GameContext';
import './styles.css';

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setTargetActor, state, dispatch } = useGame();
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

  const handleStartGame = async () => {
    try {
      const targetActor = await getTargetActor();
      setTargetActor(targetActor);
      // Start the timer if enabled
      if (state.settings.timerEnabled) {
        dispatch({ type: 'START_TIMER' });
      }
      navigate('/start');
    } catch (error) {
      console.error('Failed to start game:', error);
    }
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
    <div className="home-page" style={{ maxWidth: 800, margin: '0 auto', padding: '2em', textAlign: 'center' }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '0.5em', 
        color: 'var(--text-primary)',
        fontWeight: '600'
      }}>
        We Are All Connected Through 6 Degrees of Separation
      </h1>
      <p style={{ 
        fontSize: '1.1rem', 
        marginBottom: '2.5em', 
        color: 'var(--text-primary)',
        fontWeight: '400',
        maxWidth: '600px',
        margin: '0 auto 2.5em',
        lineHeight: '1.3',
        padding: '1em',
        borderRadius: '12px',
        background: 'var(--bg-panel)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        1. Choose a starting actor from the popular actors list<br /><br />
        2. Select a movie they starred in<br /><br />
        3. Pick another actor from that movie<br /><br />
        4. Repeat until you reach the target actor!<br />
        <br />
        Try to find the shortest path possible. You can enable a timer or set a maximum number of moves in the settings menu.
      </p>

      <button
        onClick={handleStartGame}
        className="btn"
        style={{
          background: 'var(--color-cinema-red)',
          color: 'white',
          padding: '1em 2em',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        Start Game
      </button>
    </div>
  );
};

export default HomePage; 