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
  const { state, selectActor, resetGame } = useGame();
  const navigate = useNavigate();

  const currentMovie = state.currentPath[state.currentPath.length - 1]?.movie;

  useEffect(() => {
    if (!currentMovie) {
      navigate('/');
      return;
    }

    const fetchCast = async () => {
      try {
        setLoading(true);
        const castData = await getCastByMovie(currentMovie.id);
        setCast(castData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch cast. Please try again later.');
        setLoading(false);
      }
    };

    fetchCast();
  }, [currentMovie, navigate]);

  const handleSelectActor = (actor: Actor) => {
    selectActor(actor);
    
    // Check game status after selecting actor
    if (state.targetActor && actor.id === state.targetActor.id) {
      // Win condition
      setTimeout(() => navigate('/end'), 500);
    } else if (state.currentPath.length >= state.maxHops) {
      // Lose condition (max hops reached)
      setTimeout(() => navigate('/end'), 500);
    } else {
      // Continue game
      navigate('/movies');
    }
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
    <div className="cast-selection-page">
      <GameStatus />
      
      <h1>Select an Actor</h1>
      <h2>Cast of {currentMovie?.title}</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search actors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredCast.length === 0 ? (
        <div className="no-results">No actors found matching your search.</div>
      ) : (
        <div className="grid-container">
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