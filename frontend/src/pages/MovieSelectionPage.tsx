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

  useEffect(() => {
    console.log('[MovieSelectionPage] currentActor:', currentActor);
    console.log('[MovieSelectionPage] state:', state);
    console.log('[MovieSelectionPage] movies:', movies);
  }, [currentActor, state, movies]);

  const handleSelectMovie = (movie: Movie) => {
    console.log('[MovieSelectionPage] handleSelectMovie selected movie:', movie);
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
    <div className="movie-selection-page">
      <GameStatus />
      
      <h1>Select a Movie</h1>
      <h2>Movies starring {currentActor?.name}</h2>

      {movies.length === 0 ? (
        <div className="no-results">No movies found for this actor.</div>
      ) : (
        <div className="grid-container">
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