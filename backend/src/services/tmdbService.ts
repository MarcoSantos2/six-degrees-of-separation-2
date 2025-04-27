import axios from 'axios';
import dotenv from 'dotenv';
import { Actor, Cast, MovieCredits, Movie } from '../types';

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_API_BASE_URL || 'https://api.themoviedb.org/3';

// Debug info
console.log('API Key exists:', !!API_KEY);
console.log('Using BASE_URL:', BASE_URL);

// Validate API key
if (!API_KEY) {
  console.warn('⚠️ TMDB_API_KEY is not set in the .env file. Using mock data for development.');
}

// Create axios instance with default params
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Rate limiting logic - simple implementation
const REQUESTS_PER_SECOND = 3;
let requestsThisSecond = 0;
let lastRequestTime = Date.now();

const rateLimitRequest = async <T>(requestFn: () => Promise<T>): Promise<T> => {
  const now = Date.now();
  if (now - lastRequestTime > 1000) {
    // Reset if more than a second has passed
    requestsThisSecond = 0;
    lastRequestTime = now;
  }

  if (requestsThisSecond >= REQUESTS_PER_SECOND) {
    const delay = 1000 - (now - lastRequestTime);
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    requestsThisSecond = 0;
    lastRequestTime = Date.now();
  }

  requestsThisSecond++;
  return requestFn();
};

// List of popular actors to randomize
const popularActors = [
  { id: 1397778, name: "Anya Taylor-Joy" },
  { id: 287, name: "Brad Pitt" },
  { id: 1245, name: "Scarlett Johansson" },
  { id: 6193, name: "Leonardo DiCaprio" },
  { id: 1136406, name: "Tom Hanks" },
  { id: 2192, name: "Meryl Streep" },
  { id: 1813, name: "Anne Hathaway" },
  { id: 5292, name: "Denzel Washington" },
  { id: 74568, name: "Chris Hemsworth" },
  { id: 224513, name: "Florence Pugh" },
  { id: 1283, name: "Helena Bonham Carter" },
  { id: 17605, name: "Keanu Reeves" }
];

// Get random target actor
export const getTargetActor = async (): Promise<Actor> => {
  // Choose random actor from the list
  const randomActor = popularActors[Math.floor(Math.random() * popularActors.length)];
  console.log('Using random target actor:', randomActor.name);
  
  return rateLimitRequest(async () => {
    try {
      const response = await tmdbApi.get(`/person/${randomActor.id}`);
      console.log('TMDB API response status:', response.status);
      return {
        id: response.data.id,
        name: response.data.name,
        profile_path: response.data.profile_path,
      };
    } catch (error: any) {
      console.error('TMDB API error:', error.message);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  });
};

// Get movies by actor ID
export const getMoviesByActor = async (actorId: number): Promise<Movie[]> => {
  return rateLimitRequest(async () => {
    const response = await tmdbApi.get<MovieCredits>(`/person/${actorId}/movie_credits`);
    return response.data.cast.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    }));
  });
};

// Get cast by movie ID
export const getCastByMovie = async (movieId: number): Promise<Actor[]> => {
  return rateLimitRequest(async () => {
    const response = await tmdbApi.get<Cast>(`/movie/${movieId}/credits`);
    return response.data.cast.map((actor) => ({
      id: actor.id,
      name: actor.name,
      profile_path: actor.profile_path,
    }));
  });
}; 