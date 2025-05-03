import request from 'supertest';
import express from 'express';
import gameRoutes from '../routes/gameRoutes';
import * as tmdbService from '../services/tmdbService';

// Mock the TMDB service
jest.mock('../services/tmdbService');
const mockTmdbService = tmdbService as jest.Mocked<typeof tmdbService>;

// Create test app
const app = express();
app.use(express.json());
app.use('/api', gameRoutes);

describe('Game API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/target', () => {
    it('should return the target actor', async () => {
      // Mock data
      const mockActor = { id: 1, name: 'Jim Parsons', profile_path: '/path' };
      mockTmdbService.getTargetActor.mockResolvedValue(mockActor);

      // Test endpoint
      const res = await request(app).get('/api/target');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockActor);
      expect(mockTmdbService.getTargetActor).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/movies', () => {
    it('should return movies for a given actor', async () => {
      // Mock data
      const mockMovies = [
        { id: 101, title: 'Movie 1', poster_path: '/path1', release_date: '2020-01-01' },
        { id: 102, title: 'Movie 2', poster_path: '/path2', release_date: '2021-01-01' },
      ];
      mockTmdbService.getMoviesByActor.mockResolvedValue(mockMovies);

      // Test endpoint
      const res = await request(app).get('/api/movies?actorId=1');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockMovies);
      expect(mockTmdbService.getMoviesByActor).toHaveBeenCalledWith(1);
    });

    it('should return 400 if actorId is missing', async () => {
      const res = await request(app).get('/api/movies');
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/cast', () => {
    it('should return cast for a given movie', async () => {
      // Mock data
      const mockCast = [
        { id: 1, name: 'Actor 1', profile_path: '/path1' },
        { id: 2, name: 'Actor 2', profile_path: '/path2' },
      ];
      mockTmdbService.getCastByMedia.mockResolvedValue(mockCast);

      // Test endpoint
      const res = await request(app).get('/api/cast?movieId=101');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCast);
      expect(mockTmdbService.getCastByMedia).toHaveBeenCalledWith(101, 'movie');
    });

    it('should return 400 if movieId is missing', async () => {
      const res = await request(app).get('/api/cast');
      expect(res.status).toBe(400);
    });
  });
}); 