import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import ActorCard from '../components/ActorCard';
import './styles.css';

// Additional popular actors to choose from
const additionalActors = [
  { id: 31, name: 'Tom Hanks', profile_path: '/xndWFsBlClOJFRdhSt4NBwiPq0o.jpg' },
  { id: 3894, name: 'Christian Bale', profile_path: '/AcD1HrX7gzy9XNVFVX2wSp7lWGS.jpg' },
  { id: 1892, name: 'Matt Damon', profile_path: '/l9DbR1V4IUf4G8kKuEnWW5clzpx.jpg' },
  { id: 976, name: 'Jason Statham', profile_path: '/whNwkEQYWLFJA8ij0WyOOAD5xhQ.jpg' },
  { id: 8691, name: 'Ryan Gosling', profile_path: '/aGM3BQI0jqKI4qNYZxhJKmPxaml.jpg' },
];

const StartPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allActors, setAllActors] = useState<any[]>([]);
  const { startGame } = useGame();
  const navigate = useNavigate();

  // Default starting actors
  const defaultActors = [
    { id: 4724, name: 'Kevin Bacon', profile_path: '/rHThJs2Ps8pDI6KjCrM6FzRLSgm.jpg' },
    { id: 1136406, name: 'Tom Hanks', profile_path: '/xndWFsBlClOJFRdhSt4NBwiPq0o.jpg' },
    { id: 1813, name: 'Anne Hathaway', profile_path: '/tLelKoPNiyJCSEtQTz1FGv4TLGc.jpg' },
    { id: 287, name: 'Brad Pitt', profile_path: '/huV2cdcolEUwJy38hH4V2YtKKXx.jpg' },
    { id: 1245, name: 'Scarlett Johansson', profile_path: '/6NsMbJXRlDZuDzatN2akFdGuTvx.jpg' },
    { id: 6161, name: 'Leonardo DiCaprio', profile_path: '/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg' },
  ];

  useEffect(() => {
    // Combine default and additional actors
    setAllActors([...defaultActors, ...additionalActors]);
  }, []);

  useEffect(() => {
    console.log('[StartPage] allActors:', allActors);
  }, [allActors]);

  const handleStartGame = (actor: typeof defaultActors[0]) => {
    console.log('[StartPage] handleStartGame selected actor:', actor);
    startGame(actor);
    navigate('/movies');
  };

  const handleRandomStart = () => {
    const randomActor = allActors[Math.floor(Math.random() * allActors.length)];
    console.log('[StartPage] handleRandomStart selected actor:', randomActor);
    startGame(randomActor);
    navigate('/movies');
  };

  const filteredActors = searchTerm
    ? allActors.filter(actor => 
        actor.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allActors;

  // Helper function to get fallback image URL if profile_path is null
  const getActorImageUrl = (actor: any) => {
    if (actor.profile_path) {
      return `https://image.tmdb.org/t/p/w200${actor.profile_path}`;
    }
    return 'https://via.placeholder.com/200x300?text=No+Image';
  };

  return (
    <div className="start-page">
      <h1>Choose a Starting Actor</h1>
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
            actor={{
              ...actor,
              profile_path: getActorImageUrl(actor)
            }}
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