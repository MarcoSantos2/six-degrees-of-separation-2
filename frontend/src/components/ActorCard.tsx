import React from 'react';
import { Actor } from '../types';
import './styles.css';

interface ActorCardProps {
  actor: Actor;
  onClick?: () => void;
}

const ActorCard: React.FC<ActorCardProps> = ({ actor, onClick }) => {
  const imageUrl = actor.profile_path
    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
    : 'https://via.placeholder.com/200x300?text=No+Image';

  return (
    <div className="card actor-card" onClick={onClick}>
      <img src={imageUrl} alt={actor.name} className="card-image" />
      <div className="card-title">{actor.name}</div>
    </div>
  );
};

export default ActorCard; 