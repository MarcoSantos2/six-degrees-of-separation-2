import { Router } from 'express';
import { getTarget, getMedia, getCast, getPopularActorsList, searchMediaByTitle } from '../controllers/gameController';

const router = Router();

// Game routes
router.get('/target', getTarget);
router.get('/media', getMedia);
router.get('/cast', getCast);
router.get('/popular-actors', getPopularActorsList);
router.get('/search-media', searchMediaByTitle);

export default router; 