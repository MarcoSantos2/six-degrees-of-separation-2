import React, { useState } from 'react';
import './styles.css';

interface ActorImage {
  file_path: string;
  vote_count: number;
}

interface Actor {
  id: number;
  name: string;
  profile_path: string;
  images?: ActorImage[];
}

interface ActorCardProps {
  actor: Actor;
  onClick: () => void;
}

const ActorCard: React.FC<ActorCardProps> = ({ actor, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getBestImageUrl = () => {
    // If we have additional images, try to use them
    if (actor.images && actor.images.length > 0) {
      // Sort images by vote_count in descending order
      const sortedImages = [...actor.images].sort((a, b) => b.vote_count - a.vote_count);
      
      // Try the current image index
      if (currentImageIndex < sortedImages.length) {
        return `https://image.tmdb.org/t/p/w200${sortedImages[currentImageIndex].file_path}`;
      }
    }
    
    // Fallback to profile_path if available
    if (actor.profile_path) {
      return `https://image.tmdb.org/t/p/w200${actor.profile_path}`;
    }
    
    // Final fallback
    return 'https://placehold.co/200x300?text=No+Image';
  };

  const handleImageError = () => {
    if (actor.images && currentImageIndex < actor.images.length - 1) {
      // Try the next image
      setCurrentImageIndex(prev => prev + 1);
    } else {
      // If no more images to try, show placeholder
      setImageError(true);
    }
  };

  return (
    <div className="card" onClick={onClick}>
      <img
        src={getBestImageUrl()}
        alt={actor.name}
        onError={handleImageError}
        className="card-image"
      />
      <div className="card-title">{actor.name}</div>
    </div>
  );
};

export default ActorCard; 