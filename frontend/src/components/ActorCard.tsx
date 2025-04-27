import React, { useState } from 'react';
import { Actor } from '../types';
import './styles.css';

interface ActorCardProps {
  actor: Actor;
  onClick?: () => void;
}

const ActorCard: React.FC<ActorCardProps> = ({ actor, onClick }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = imageError || !actor.profile_path
    ? 'https://via.placeholder.com/200x300?text=No+Image'
    : actor.profile_path.startsWith('http')
      ? actor.profile_path // If it's already a full URL
      : `https://image.tmdb.org/t/p/w200${actor.profile_path}`; // If it's just the path

  console.log({ imageUrl, actor });

  return (
    <div className="card actor-card" onClick={onClick}>
      <img 
        src={imageUrl} 
        alt={actor.name} 
        className="card-image" 
        onError={handleImageError}
      />
      <div className="card-title">{actor.name}</div>
    </div>
  );
};

export default ActorCard; 