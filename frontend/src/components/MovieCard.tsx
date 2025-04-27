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

  const imageUrl = imageError || !movie.poster_path
    ? 'https://via.placeholder.com/200x300?text=No+Poster'
    : movie.poster_path.startsWith('http')
      ? movie.poster_path
      : `https://image.tmdb.org/t/p/w200${movie.poster_path}`;

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

  return (
    <div className="card movie-card" onClick={onClick}>
      <img 
        src={imageUrl} 
        alt={movie.title} 
        className="card-image" 
        onError={handleImageError}
      />
      <div className="card-title">{movie.title}</div>
      <div className="card-year">{year}</div>
    </div>
  );
};

export default MovieCard; 