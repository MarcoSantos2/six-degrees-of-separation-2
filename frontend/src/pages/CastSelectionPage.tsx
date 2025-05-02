import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { getCastByMovie } from '../services/api';
import ActorCard from '../components/ActorCard';
import GameStatus from '../components/GameStatus';
import { Actor } from '../types';
import './styles.css';

const CastSelectionPage: React.FC = () => {
  const [cast, setCast] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { state, selectActor, pauseTimer, resumeTimer } = useGame();
  const navigate = useNavigate();

  const currentMovie = state.currentPath[state.currentPath.length - 1]?.movie;

  useEffect(() => {
    const fetchCast = async () => {
      if (!state.currentPath.length || !state.currentPath[state.currentPath.length - 1].movie) {
        navigate('/movies');
        return;
      }

      try {
        setLoading(true);
        if (state.settings.timerEnabled) {
          pauseTimer();
        }
        const movieId = state.currentPath[state.currentPath.length - 1].movie!.id;
        const castData = await getCastByMovie(movieId);
        setCast(castData);
      } catch (err) {
        setError('Failed to fetch cast. Please try again later.');
      } finally {
        setLoading(false);
        if (state.settings.timerEnabled) {
          resumeTimer();
        }
      }
    };

    fetchCast();
  }, [state.currentPath, navigate, state.settings.timerEnabled, pauseTimer, resumeTimer]);

  const handleSelectActor = (actor: Actor) => {
    // Check win condition before updating state
    if (state.targetActor && actor.id === state.targetActor.id) {
      selectActor(actor);
      // Win condition
      setTimeout(() => navigate('/end'), 500);
      return;
    } 
    
    // Check lose condition - Calculate number of hops
    // A complete hop is: Actor -> Movie -> Actor
    // So we need to count complete cycles in the path
    const totalSteps = state.currentPath.length;
    // After selecting this actor, we'll have one more complete cycle
    const hopsMade = totalSteps + 1;
    
    if (hopsMade >= state.maxHops) {
      selectActor(actor);
      // Lose condition (max hops reached)
      setTimeout(() => navigate('/end'), 500);
      return;
    } 
    
    // Continue game
    selectActor(actor);
    navigate('/movies');
  };

  const filteredCast = searchTerm
    ? cast.filter(actor => 
        actor.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cast;

  if (loading) {
    return <div className="loading">Loading cast...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="cast-selection-page panel" style={{ maxWidth: 900, margin: '2em auto', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>
      <GameStatus />
      <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5em', textAlign: 'center', letterSpacing: '0.08em' }}>Select an Actor</h1>
      <h2 style={{ textAlign: 'center', color: 'var(--color-cinema-red)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '2em' }}>
        Cast of {currentMovie?.title}
      </h2>
      <div className="search-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5em' }}>
        <input
          type="text"
          placeholder="Search actors..."
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
          aria-label="Search actors"
        />
      </div>
      {filteredCast.length === 0 ? (
        <div className="no-results" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No actors found matching your search.</div>
      ) : (
        <div className="grid-container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1.5em',
          margin: '0 auto',
          maxWidth: 800
        }}>
          {filteredCast.map(actor => (
            <ActorCard
              key={actor.id}
              actor={actor}
              onClick={() => handleSelectActor(actor)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CastSelectionPage; 