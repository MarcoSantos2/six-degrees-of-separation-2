import { Request, Response } from 'express';
import { getTargetActor, getMoviesByActor, getCastByMovie, getPopularActors } from '../services/tmdbService';

// GET /api/target - returns the target actor
export const getTarget = async (_req: Request, res: Response): Promise<void> => {
  try {
    console.log('Getting target actor...');
    const targetActor = await getTargetActor();
    console.log('Target actor response:', targetActor);
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

// GET /api/popular-actors - returns a list of popular actors
export const getPopularActorsList = async (_req: Request, res: Response): Promise<void> => {
  try {
    console.log('Getting popular actors...');
    const actors = await getPopularActors();
    console.log('Popular actors response:', actors);
    res.json(actors);
  } catch (error) {
    console.error('Error fetching popular actors:', error);
    res.status(500).json({ message: 'Failed to fetch popular actors' });
  }
}; 