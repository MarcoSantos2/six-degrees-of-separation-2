import { Router } from 'express';
import { getTarget, getMovies, getCast } from '../controllers/gameController';

const router = Router();

// Game routes
router.get('/target', getTarget);
router.get('/movies', getMovies);
router.get('/cast', getCast);

export default router; 