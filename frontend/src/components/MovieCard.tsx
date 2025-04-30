import React, { useState } from 'react';
import { Movie } from '../types';
import './styles.css';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = !movie.poster_path || imageError
    ? 'https://placehold.co/200x300?text=No+Image'
    : movie.poster_path.startsWith('http')
      ? movie.poster_path
      : `https://image.tmdb.org/t/p/w200${movie.poster_path}`;

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

  return (
    <div className="card movie-card" onClick={onClick} style={{
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
    aria-label={`Select movie ${movie.title}`}
    >
      <img 
        src={imageUrl} 
        alt={movie.title} 
        className="card-image" 
        onError={handleImageError}
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
      <div className="card-title" title={movie.title} style={{
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: '1.1rem',
        color: 'var(--color-midnight-black)',
        textAlign: 'center',
        marginTop: 4,
        letterSpacing: '0.04em',
        lineHeight: 1.2,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        maxHeight: '3.9em', // ~3 lines
        wordBreak: 'break-word',
      }}>{movie.title}</div>
      <div className="card-year" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 2 }}>{year}</div>
    </div>
  );
};

export default MovieCard; 