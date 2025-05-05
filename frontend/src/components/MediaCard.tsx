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
  const year = releaseDate?.split('-')[0] || 'Unknown year';

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjY2Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  };

  return (
    <div className="card media-card" onClick={() => onClick(media)} style={{
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
      minHeight: 280,
      width: '100%',
      maxWidth: 180,
      margin: '0 auto',
    }}
    tabIndex={0}
    aria-label={`Select ${media.media_type} ${title}`}
    >
      <div style={{ position: 'relative', width: '100%' }}>
        <img 
          src={imageUrl} 
          alt={title} 
          className="card-image" 
          onError={handleImageError}
          style={{
            width: '100%',
            height: 240,
            objectFit: 'cover',
            borderRadius: 8,
            background: '#eee',
            marginBottom: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }}
        />
      </div>
      <div className="card-title" title={title} style={{
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
        width: '100%'
      }}>{title}</div>
      <div className="card-year" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 2 }}>{year}</div>
      <div className="media-type-badge" style={{
        marginTop: 8,
        background: '#2a2a2a',
        color: '#fff',
        padding: '2px 10px',
        borderRadius: 6,
        fontSize: '0.85rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        alignSelf: 'center',
        display: 'inline-block'
      }}>
        {media.media_type === 'movie' ? 'Movie' : 'TV'}
      </div>
    </div>
  );
};

export default MediaCard; 