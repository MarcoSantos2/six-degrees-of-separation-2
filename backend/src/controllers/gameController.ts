import { Request, Response } from 'express';
import { getTargetActor, getMediaByActor, getCastByMedia, getPopularActors, searchMedia } from '../services/tmdbService';
import { MediaFilter } from '../types';

// GET /api/target - returns the target actor
export const getTarget = async (_req: Request, res: Response): Promise<void> => {
  console.log('Target actor request received');
  try {
    console.log('Getting target actor...');
    const targetActor = await getTargetActor();
    console.log('Target actor response:', targetActor);
    res.json(targetActor);
  } catch (error) {
    console.error('Error fetching target actor:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    res.status(500).json({ 
      message: 'Failed to fetch target actor',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET /api/media?actorId=<id>&mediaFilter=<filter> - returns media for a given actor
export const getMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const actorId = Number(req.query.actorId);
    const mediaFilter = (req.query.mediaFilter as MediaFilter) || 'ALL_MEDIA';
    
    if (!actorId || isNaN(actorId)) {
      res.status(400).json({ message: 'Valid actorId is required' });
      return;
    }
    
    const media = await getMediaByActor(actorId, mediaFilter);
    res.json(media);
  } catch (error) {
    console.error('Error fetching media by actor:', error);
    res.status(500).json({ 
      message: 'Failed to fetch media',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET /api/cast?mediaId=<id>&mediaType=<type> - returns cast list for a given media
export const getCast = async (req: Request, res: Response): Promise<void> => {
  try {
    const mediaId = Number(req.query.mediaId);
    const mediaType = req.query.mediaType as 'movie' | 'tv';
    
    if (!mediaId || isNaN(mediaId)) {
      res.status(400).json({ message: 'Valid mediaId is required' });
      return;
    }

    if (!mediaType || !['movie', 'tv'].includes(mediaType)) {
      res.status(400).json({ message: 'Valid mediaType (movie or tv) is required' });
      return;
    }
    
    const cast = await getCastByMedia(mediaId, mediaType);
    res.json(cast);
  } catch (error) {
    console.error('Error fetching cast by media:', error);
    res.status(500).json({ message: 'Failed to fetch cast' });
  }
};

// GET /api/popular-actors - returns a list of popular actors
export const getPopularActorsList = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Getting popular actors...');
    const filterByWestern = req.query.filterByWestern !== 'false'; // Default to true if not specified
    console.log('Filter by Western countries:', filterByWestern);
    const actors = await getPopularActors(filterByWestern);
    console.log('Popular actors response:', actors.length);
    res.json(actors);
  } catch (error) {
    console.error('Error fetching popular actors:', error);
    res.status(500).json({ 
      message: 'Failed to fetch popular actors',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET /api/search-media?query=<search_term>&mediaFilter=<filter> - returns media matching the search query
export const searchMediaByTitle = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.query as string;
    const mediaFilter = (req.query.mediaFilter as MediaFilter) || 'ALL_MEDIA';
    
    if (!query) {
      res.status(400).json({ message: 'Search query is required' });
      return;
    }
    
    const media = await searchMedia(query, mediaFilter);
    res.json(media);
  } catch (error) {
    console.error('Error searching media:', error);
    res.status(500).json({ message: 'Failed to search media' });
  }
}; 