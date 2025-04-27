import { Router } from 'express';
import { getTarget, getMovies, getCast, getPopularActorsList } from '../controllers/gameController';

const router = Router();

// Game routes
router.get('/target', getTarget);
router.get('/movies', getMovies);
router.get('/cast', getCast);
router.get('/popular-actors', getPopularActorsList);

export default router; 