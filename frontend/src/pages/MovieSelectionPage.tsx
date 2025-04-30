import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { getMoviesByActor } from '../services/api';
import MovieCard from '../components/MovieCard';
import GameStatus from '../components/GameStatus';
import { Movie } from '../types';
import './styles.css';

const MovieSelectionPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { state, selectMovie } = useGame();
  const navigate = useNavigate();

  const currentActor = state.currentPath[state.currentPath.length - 1]?.actor;

  useEffect(() => {
    if (!currentActor) {
      navigate('/');
      return;
    }

    const fetchMovies = async () => {
      try {
        setLoading(true);
        const movieData = await getMoviesByActor(currentActor.id);
        setMovies(movieData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentActor, navigate]);

  const handleSelectMovie = (movie: Movie) => {
    selectMovie(movie);
    navigate('/cast');
  };

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="movie-selection-page panel" style={{ maxWidth: 900, margin: '2em auto', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>
      <GameStatus />
      <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5em', textAlign: 'center', letterSpacing: '0.08em' }}>Select a Movie</h1>
      <h2 style={{ textAlign: 'center', color: 'var(--color-cinema-red)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '2em' }}>
        Movies starring {currentActor?.name}
      </h2>
      {movies.length === 0 ? (
        <div className="no-results" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No movies found for this actor.</div>
      ) : (
        <div className="grid-container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1.5em',
          margin: '0 auto',
          maxWidth: 800
        }}>
          {movies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => handleSelectMovie(movie)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieSelectionPage; 