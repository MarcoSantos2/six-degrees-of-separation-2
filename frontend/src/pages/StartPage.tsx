import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import ActorCard from '../components/ActorCard';
import './styles.css';

const StartPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleStartGame = (actor: typeof defaultActors[0]) => {
    startGame(actor);
    navigate('/movies');
  };

  const filteredActors = searchTerm
    ? defaultActors.filter(actor => 
        actor.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : defaultActors;

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