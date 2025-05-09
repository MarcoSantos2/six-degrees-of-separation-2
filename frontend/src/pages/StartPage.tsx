import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import ActorCard from '../components/ActorCard';
import { getPopularActors } from '../services/api';
import { Actor } from '../types';
import './styles.css';

const StartPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { startGame, state, setPopularActors } = useGame();
  const navigate = useNavigate();

  // Memoize a key for the current settings to avoid stale cache
  const settingsKey = `${state.settings.filterByWestern}_${state.settings.mediaFilter}`;
  const [lastSettingsKey, setLastSettingsKey] = useState(settingsKey);

  useEffect(() => {
    // Only fetch if we don't already have actors for the current settings
    if (!state.popularActors || state.popularActors.length === 0 || lastSettingsKey !== settingsKey) {
      const fetchActors = async () => {
        try {
          setLoading(true);
          const actors = await getPopularActors(state.settings.filterByWestern, state.settings.mediaFilter);
          setPopularActors(actors);
          setLoading(false);
          setLastSettingsKey(settingsKey);
        } catch (err) {
          setError('Failed to fetch actors. Please try again later.');
          setLoading(false);
        }
      };
      fetchActors();
    } else {
      setLoading(false);
    }
  }, [state.settings.filterByWestern, state.settings.mediaFilter, setPopularActors, state.popularActors, settingsKey, lastSettingsKey]);

  useEffect(() => {
    // If we don't have a target actor, redirect to home
    if (!state.targetActor) {
      navigate('/');
    }
  }, [state.targetActor, navigate]);

  const handleStartGame = (actor: Actor) => {
    if (!state.targetActor) {
      navigate('/');
      return;
    }
    startGame(actor);
    navigate('/movies');
  };

  const handleRandomStart = () => {
    if (!state.targetActor) {
      navigate('/');
      return;
    }
    const popularActors: Actor[] = state.popularActors || [];
    const randomActor = popularActors.length > 0
      ? popularActors[Math.floor(Math.random() * popularActors.length)]
      : null;
    if (randomActor) {
      startGame(randomActor);
      navigate('/movies');
    }
  };

  // Deduplicate actors by id
  const uniqueActors = state.popularActors
    ? Array.from(new Map(state.popularActors.map(actor => [actor.id, actor])).values())
    : [];

  // TEST-ONLY: Win Game button for development - TODO: NEVER SEND TO PRODUCTION
  const handleTestWin = () => {
    if (!state.targetActor) return;
    // Simulate a path of 3 steps (can be adjusted)
    const fakeActor = state.popularActors && state.popularActors.length > 0 ? state.popularActors[0] : state.targetActor;
    const fakePath = [
      { actor: fakeActor },
      { actor: state.targetActor }
    ];
    // Set up the win state
    state.currentPath = fakePath;
    state.gameStatus = 'won';
    navigate('/end');
  };

  if (!state.targetActor) {
    return <div className="loading">Loading game data...</div>;
  }

  if (loading) {
    return <div className="loading">Loading actors...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="start-page panel" style={{ 
      maxWidth: 1100, 
      margin: '1.5em auto', 
      position: 'relative',
      zIndex: 1,
      padding: '0 0 20px 0'
    }}>
      <h1 style={{ marginBottom: '0.5em', textAlign: 'center' }}>Choose a Starting Actor</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '2em' }}>
        Connect actors to the target by hopping through movies and co-stars. How few steps can you do it in?
      </p>
      <div className="choice-buttons" style={{ display: 'flex', justifyContent: 'center', marginBottom: '2em' }}>
        <button 
          className="btn"
          style={{ background: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', fontWeight: 700, fontSize: '1.1rem' }}
          onClick={handleRandomStart}
        >
          Choose Random Actor
        </button>
      </div>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '2em',
        color: 'var(--text-main)',
        fontSize: '1.1rem'
      }}>
        Or
        <div style={{ 
          marginTop: '1.5em',
          fontSize: '1.1rem',
          color: 'var(--text-main)'
        }}>
          Select an actor from the list below
        </div>
      </div>
      <div className="grid-container">
        {uniqueActors.map(actor => (
          <ActorCard
            key={actor.id}
            actor={actor}
            onClick={() => handleStartGame(actor)}
          />
        ))}
      </div>
      {import.meta.env.DEV && (
        <button
          style={{ margin: '2em auto', display: 'block', background: '#22c55e', color: 'white', fontWeight: 700, fontSize: '1.1rem', borderRadius: 8, padding: '1em 2em', border: 'none', cursor: 'pointer' }}
          onClick={handleTestWin}
        >
          Win Game (Test)
        </button>
      )}
    </div>
  );
};

export default StartPage; 