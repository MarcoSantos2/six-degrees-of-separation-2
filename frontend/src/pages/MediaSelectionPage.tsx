import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { getMediaByActor } from '../services/api';
import MediaCard from '../components/MediaCard';
import GameStatus from '../components/GameStatus';
import { Media } from '../types';
import './styles.css';

const MediaSelectionPage: React.FC = () => {
  const [allMedia, setAllMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { state, selectMedia, pauseTimer, resumeTimer } = useGame();
  const navigate = useNavigate();

  const currentActor = state.currentPath[state.currentPath.length - 1]?.actor;

  useEffect(() => {
    if (!currentActor) {
      navigate('/');
      return;
    }

    const fetchMedia = async () => {
      try {
        setLoading(true);
        if (state.settings.timerEnabled) {
          pauseTimer();
        }
        const mediaData = await getMediaByActor(currentActor.id, state.settings.mediaFilter);
        setAllMedia(mediaData);
      } catch (err) {
        setError('Failed to fetch media. Please try again later.');
      } finally {
        setLoading(false);
        if (state.settings.timerEnabled) {
          resumeTimer();
        }
      }
    };

    fetchMedia();
  }, [currentActor, navigate, state.settings.timerEnabled, state.settings.mediaFilter, pauseTimer, resumeTimer]);

  const handleSelectMedia = (media: Media) => {
    selectMedia(media);
    navigate('/cast');
  };

  // Deduplicate media by id
  const uniqueMedia = Array.from(new Map(allMedia.map(media => [media.id, media])).values());

  const filteredMedia = searchTerm
    ? uniqueMedia.filter(media => 
        (media.title || media.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : uniqueMedia;

  if (loading) {
    return <div className="loading">Loading media...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const mediaTypeLabel = state.settings.mediaFilter === 'MOVIES_ONLY' ? 'Movies' :
    state.settings.mediaFilter === 'TV_ONLY' ? 'TV Shows' : 'Movies & TV Shows';

  return (
    <div className="media-selection-page panel" style={{ 
      maxWidth: 1280, 
      margin: '0 auto',
      padding: '8px 32px',
      minHeight: 'calc(100vh - 124.59px)'
    }}>
      <GameStatus />
      <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5em', textAlign: 'center', letterSpacing: '0.08em' }}>Select a {mediaTypeLabel}</h1>
      <h2 style={{ textAlign: 'center', color: 'var(--color-cinema-red)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '2em' }}>
        {mediaTypeLabel} starring {currentActor?.name}
      </h2>
      <div className="search-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5em' }}>
        <input
          type="text"
          placeholder={`Search ${mediaTypeLabel.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{
            padding: '0.7em 1.2em',
            borderRadius: 8,
            border: '1px solid var(--border)',
            fontSize: '1.1rem',
            width: 320,
            maxWidth: '90%',
            background: 'var(--bg-panel)',
            color: 'var(--text-main)',
            outline: 'none',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}
          aria-label={`Search ${mediaTypeLabel.toLowerCase()}`}
        />
      </div>
      {filteredMedia.length === 0 ? (
        <div className="no-results" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No {mediaTypeLabel.toLowerCase()} found matching your search.</div>
      ) : (
        <div className="grid-container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1.5em',
          margin: '0 auto',
          maxWidth: '100%'
        }}>
          {filteredMedia.map(media => (
            <MediaCard
              key={media.id}
              media={media}
              onClick={() => handleSelectMedia(media)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaSelectionPage; 