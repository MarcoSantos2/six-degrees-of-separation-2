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
    if (!state.targetActor) {
      try {
        const targetActor = await getTargetActor();
        setTargetActor(targetActor);
      } catch (error) {
        console.error('Failed to start game:', error);
        return;
      }
    }
    // Start the timer if enabled
    if (state.settings.timerEnabled) {
      dispatch({ type: 'START_TIMER' });
    }
    navigate('/start');
  };

  // TEST-ONLY: Win Game button for development
  const handleTestWin = () => {
    if (!state.targetActor) return;
    // Use up to 5 popular actors plus the target for a 6-step path
    const actors = state.popularActors && state.popularActors.length > 0
      ? state.popularActors.slice(0, 5)
      : [state.targetActor, state.targetActor, state.targetActor, state.targetActor, state.targetActor];
    const fakePath = [
      { actor: actors[0] },
      { actor: actors[1], media: { title: "Fake Movie 1", media_type: 'movie' as const, poster_path: null, id: 1 } },
      { actor: actors[2], media: { title: "Fake Movie 2", media_type: 'movie' as const, poster_path: null, id: 2 } },
      { actor: actors[3], media: { title: "Fake Movie 3", media_type: 'movie' as const, poster_path: null, id: 3 } },
      { actor: actors[4], media: { title: "Fake Movie 4", media_type: 'movie' as const, poster_path: null, id: 4 } },
      { actor: state.targetActor, media: { title: "Final Movie", media_type: 'movie' as const, poster_path: null, id: 5 } }
    ];
    state.currentPath = fakePath;
    state.gameStatus = 'won';
    navigate('/end');
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
    <div className="home-page" style={{ maxWidth: 800, margin: '0 auto', padding: '2em', textAlign: 'center', position: 'relative', minHeight: '100vh' }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '0.5em', 
        color: 'var(--text-primary)',
        fontWeight: '600'
      }}>
        6 Degrees of Separation - We Are All Connected
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

      {import.meta.env.DEV && (
        <button
          style={{ position: 'fixed', bottom: 10, left: '50%', transform: 'translateX(-50%)', fontSize: '0.85rem', padding: '0.4em 1em', borderRadius: 6, background: '#22c55e', color: 'white', border: 'none', zIndex: 1000, opacity: 0.7 }}
          onClick={handleTestWin}
        >
          Win Game (Test)
        </button>
      )}
    </div>
  );
};

export default HomePage; 