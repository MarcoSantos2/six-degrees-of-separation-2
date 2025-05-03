import React from 'react';
import { Actor } from '../types';
import './ActorCard.css';

interface ActorCardProps {
  actor: Actor;
  onClick: (actor: Actor) => void;
}

const ActorCard: React.FC<ActorCardProps> = ({ actor, onClick }) => {
  const imageUrl = actor.profile_path 
    ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
    : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjY2Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

  return (
    <div className="actor-card" onClick={() => onClick(actor)}>
      <img src={imageUrl} alt={actor.name} className="actor-image" />
      <div className="actor-info">
        <h3>{actor.name}</h3>
      </div>
    </div>
  );
};

export default ActorCard; 