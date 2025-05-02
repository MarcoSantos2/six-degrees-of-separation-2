import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import ActorCard from '../components/ActorCard';
import { getPopularActors } from '../services/api';
import './styles.css';
import GameStatus from '../components/GameStatus';

const StartPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allActors, setAllActors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { startGame, state } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActors = async () => {
      try {
        setLoading(true);
        const actors = await getPopularActors(state.settings.filterByWestern);
        setAllActors(actors);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch actors. Please try again later.');
        setLoading(false);
      }
    };

    fetchActors();
  }, [state.settings.filterByWestern]);

  useEffect(() => {
    // If we don't have a target actor, redirect to home
    if (!state.targetActor) {
      navigate('/');
    }
  }, [state.targetActor, navigate]);

  const handleStartGame = (actor: typeof allActors[0]) => {
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
    const randomActor = allActors[Math.floor(Math.random() * allActors.length)];
    startGame(randomActor);
    navigate('/movies');
  };

  const filteredActors = searchTerm
    ? allActors.filter(actor => 
        actor.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allActors;

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
      maxWidth: 900, 
      margin: '2em auto', 
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      position: 'relative',  // Add this to create a new stacking context
      zIndex: 1  // Lower z-index for the container
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5em', textAlign: 'center', letterSpacing: '0.08em' }}>Choose a Starting Actor</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '2em' }}>
        Connect actors to the target by hopping through movies and co-stars. How few steps can you do it in?
      </p>
      <GameStatus />
      <div className="search-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '1.5em',
        position: 'relative',  // Add this to ensure proper stacking
        zIndex: 2  // Higher z-index than the grid container
      }}>
        <input
          type="text"
          placeholder="Filter actors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{
            padding: '0.7em 1.2em',
            borderRadius: 8,
            border: '1px solid var(--border)',
            fontSize: '1.1rem',
            width: 320,
            maxWidth: '90%',
            background: 'var(--bg-panel)',
            color: 'var(--text-main)',
            outline: 'none',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}
          aria-label="Filter actors"
        />
      </div>
      <div className="choice-buttons" style={{ display: 'flex', justifyContent: 'center', marginBottom: '2em' }}>
        <button 
          className="btn"
          style={{ background: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', fontWeight: 700, fontSize: '1.1rem', marginRight: 12 }}
          onClick={handleRandomStart}
        >
          Choose Random Actor
        </button>
        <button className="btn" style={{ background: 'var(--button-secondary-bg)', color: 'var(--button-secondary-text)', fontWeight: 700, fontSize: '1.1rem' }} onClick={() => navigate('/')}>Back to Home</button>
      </div>
      <div className="grid-container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1.5em',
        margin: '0 auto',
        maxWidth: 800,
        position: 'relative',  // Add this to ensure proper stacking
        zIndex: 1  // Same z-index as parent container
      }}>
        {filteredActors.map(actor => (
          <ActorCard
            key={actor.id}
            actor={actor}
            onClick={() => handleStartGame(actor)}
          />
        ))}
      </div>
    </div>
  );
};

export default StartPage; 