import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { getCastByMedia } from '../services/api';
import ActorCard from '../components/ActorCard';
import GameStatus from '../components/GameStatus';
import { Actor, Media } from '../types';
import './styles.css';

const CastSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, selectActor, pauseTimer } = useGame();
  const [cast, setCast] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCast = async () => {
      try {
        const currentPath = state.currentPath[state.currentPath.length - 1];
        if (!currentPath?.media) {
          navigate('/movies');
          return;
        }

        const currentMedia = currentPath.media;
        const castData = await getCastByMedia(currentMedia.id, currentMedia.media_type);
        setCast(castData);
      } catch (err) {
        setError('Failed to fetch cast. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCast();
  }, [state.currentPath, navigate]);

  if (loading) return <div>Loading cast...</div>;
  if (error) return <div>{error}</div>;

  const filteredCast = searchTerm
    ? cast.filter(actor => actor.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : cast;

  const currentPath = state.currentPath[state.currentPath.length - 1];
  if (!currentPath?.media) {
    navigate('/movies');
    return;
  }

  const currentMedia = currentPath.media;

  return (
    <div className="cast-selection-page panel" style={{ 
      maxWidth: 1280, 
      margin: '0 auto',
      padding: '8px 0',
      minHeight: 'calc(100vh - 124.59px)'
    }}>
      <GameStatus />
      <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5em', textAlign: 'center' }}>Select an Actor</h1>
      <h2 style={{ textAlign: 'center', color: 'var(--color-cinema-red)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '2em' }}>
        Cast of {currentMedia.media_type === 'movie' ? currentMedia.title : currentMedia.name}
      </h2>
      <div className="search-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5em' }}>
        <input
          type="text"
          placeholder="Search cast..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
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
          aria-label="Search cast"
        />
      </div>
      <div className="cast-grid">
        {filteredCast.map((actor) => (
          <ActorCard
            key={actor.id}
            actor={actor}
            onClick={() => selectActor(actor)}
          />
        ))}
      </div>
    </div>
  );
};

export default CastSelectionPage; 