/// <reference types="jest" />
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
      const mockActor = { id: 1, name: 'Jim Parsons', profile_path: '/path', known_for_department: 'Acting', popularity: 10 };
      mockTmdbService.getTargetActor.mockResolvedValue(mockActor);

      // Test endpoint
      const res = await request(app).get('/api/target');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockActor);
      expect(mockTmdbService.getTargetActor).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/cast', () => {
    it('should return cast for a given movie', async () => {
      // Mock data
      const mockCast = [
        { id: 1, name: 'Actor 1', profile_path: '/path1', known_for_department: 'Acting', popularity: 5 },
        { id: 2, name: 'Actor 2', profile_path: '/path2', known_for_department: 'Acting', popularity: 7 },
      ];
      mockTmdbService.getCastByMedia.mockResolvedValue(mockCast);

      // Test endpoint
      const res = await request(app).get('/api/cast?mediaId=101&mediaType=movie');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCast);
      expect(mockTmdbService.getCastByMedia).toHaveBeenCalledWith(101, 'movie');
    });

    it('should return cast for a given TV show (deduplicated, large)', async () => {
      // Mock a large, deduplicated cast
      const mockCast = Array.from({ length: 120 }, (_, i) => ({ id: i + 1, name: `Actor ${i + 1}`, profile_path: `/path${i + 1}`, known_for_department: 'Acting', popularity: 1 }));
      mockTmdbService.getCastByMedia.mockResolvedValue(mockCast);

      const res = await request(app).get('/api/cast?mediaId=202&mediaType=tv');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(120);
      expect(res.body[0].name).toBe('Actor 1');
      expect(mockTmdbService.getCastByMedia).toHaveBeenCalledWith(202, 'tv');
    });

    it('should return 400 if movieId is missing', async () => {
      const res = await request(app).get('/api/cast');
      expect(res.status).toBe(400);
    });
  });
}); 