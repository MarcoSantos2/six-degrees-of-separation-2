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

  return (
    <div className="cast-selection-page">
      <GameStatus />
      <div className="cast-grid">
        {cast.map((actor) => (
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