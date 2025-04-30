import { Router } from 'express';
import { getTarget, getMovies, getCast, getPopularActorsList, searchMoviesByTitle } from '../controllers/gameController';

const router = Router();

// Game routes
router.get('/target', getTarget);
router.get('/movies', getMovies);
router.get('/cast', getCast);
router.get('/popular-actors', getPopularActorsList);
router.get('/search-movies', searchMoviesByTitle);

export default router; 