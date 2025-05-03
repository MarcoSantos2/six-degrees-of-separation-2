import React from 'react';
import { Media } from '../types';
import './MediaCard.css';

interface MediaCardProps {
  media: Media;
  onClick: (media: Media) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ media, onClick }) => {
  const title = media.media_type === 'movie' ? media.title : media.name;
  const releaseDate = media.media_type === 'movie' ? media.release_date : media.first_air_date;
  const imageUrl = media.poster_path 
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjY2Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

  return (
    <div className="media-card" onClick={() => onClick(media)}>
      <img src={imageUrl} alt={title} className="media-poster" />
      <div className="media-info">
        <h3>{title}</h3>
        <p>{releaseDate?.split('-')[0] || 'Unknown year'}</p>
        <span className="media-type">{media.media_type === 'movie' ? 'Movie' : 'TV Show'}</span>
      </div>
    </div>
  );
};

export default MediaCard; 