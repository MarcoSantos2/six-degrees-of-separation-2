import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import ActorCard from '../components/ActorCard';
import { getPopularActors } from '../services/api';
import './styles.css';

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
        const actors = await getPopularActors();
        setAllActors(actors);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch actors. Please try again later.');
        setLoading(false);
      }
    };

    fetchActors();
  }, []);

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
    <div className="start-page">
      <h1>Choose a Starting Actor</h1>
      <div className="target-info">
        <p>Target Actor: <span className="highlight">{state.targetActor.name}</span></p>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Filter actors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="choice-buttons">
        <button 
          className="random-actor-button" 
          onClick={handleRandomStart}
        >
          Choose Random Actor
        </button>
      </div>

      <div className="grid-container">
        {filteredActors.map(actor => (
          <ActorCard
            key={actor.id}
            actor={actor}
            onClick={() => handleStartGame(actor)}
          />
        ))}
      </div>

      <button className="back-button" onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  );
};

export default StartPage; 