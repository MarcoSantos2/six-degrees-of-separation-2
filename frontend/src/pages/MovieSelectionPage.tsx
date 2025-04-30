import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { getMoviesByActor } from '../services/api';
import MovieCard from '../components/MovieCard';
import GameStatus from '../components/GameStatus';
import { Movie } from '../types';
import './styles.css';

const MovieSelectionPage: React.FC = () => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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
        setAllMovies(movieData);
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

  const filteredMovies = searchTerm
    ? allMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allMovies;

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
      <div className="search-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5em' }}>
        <input
          type="text"
          placeholder="Search movies..."
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
          aria-label="Search movies"
        />
      </div>
      {filteredMovies.length === 0 ? (
        <div className="no-results" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No movies found matching your search.</div>
      ) : (
        <div className="grid-container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1.5em',
          margin: '0 auto',
          maxWidth: 800
        }}>
          {filteredMovies.map(movie => (
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