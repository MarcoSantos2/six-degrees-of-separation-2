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
    if (imageError) {
      return 'https://placehold.co/200x300?text=No+Image';
    }
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
    <div className="card" onClick={onClick} style={{
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'var(--bg-panel)',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid var(--border)',
      padding: '1em',
      transition: 'box-shadow 0.2s, transform 0.2s',
      minHeight: 240,
      minWidth: 140,
      maxWidth: 180,
      margin: '0 auto',
    }}
    tabIndex={0}
    aria-label={`Select actor ${actor.name}`}
    >
      <img
        src={getBestImageUrl()}
        alt={actor.name}
        onError={handleImageError}
        className="card-image"
        style={{
          width: 100,
          height: 140,
          objectFit: 'cover',
          borderRadius: 8,
          background: '#eee',
          marginBottom: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}
      />
      <div className="card-title" style={{
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: '1.1rem',
        color: 'var(--color-midnight-black)',
        textAlign: 'center',
        marginTop: 4,
        letterSpacing: '0.04em',
        lineHeight: 1.2
      }}>{actor.name}</div>
    </div>
  );
};

export default ActorCard; 