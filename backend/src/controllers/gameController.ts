import { Request, Response } from 'express';
import { getTargetActor, getMoviesByActor, getCastByMovie } from '../services/tmdbService';

// GET /api/target - returns the target actor
export const getTarget = async (_req: Request, res: Response): Promise<void> => {
  try {
    const targetActor = await getTargetActor();
    res.json(targetActor);
  } catch (error) {
    console.error('Error fetching target actor:', error);
    res.status(500).json({ message: 'Failed to fetch target actor' });
  }
};

// GET /api/movies?actorId=<id> - returns movies for a given actor
export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const actorId = Number(req.query.actorId);
    
    if (!actorId || isNaN(actorId)) {
      res.status(400).json({ message: 'Valid actorId is required' });
      return;
    }
    
    const movies = await getMoviesByActor(actorId);
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies by actor:', error);
    res.status(500).json({ message: 'Failed to fetch movies' });
  }
};

// GET /api/cast?movieId=<id> - returns cast list for a given movie
export const getCast = async (req: Request, res: Response): Promise<void> => {
  try {
    const movieId = Number(req.query.movieId);
    
    if (!movieId || isNaN(movieId)) {
      res.status(400).json({ message: 'Valid movieId is required' });
      return;
    }
    
    const cast = await getCastByMovie(movieId);
    res.json(cast);
  } catch (error) {
    console.error('Error fetching cast by movie:', error);
    res.status(500).json({ message: 'Failed to fetch cast' });
  }
}; 