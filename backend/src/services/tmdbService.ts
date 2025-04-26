import axios from 'axios';
import dotenv from 'dotenv';
import { Actor, Cast, MovieCredits, Movie } from '../types';

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_API_BASE_URL || 'https://api.themoviedb.org/3';

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

// Get target actor (for this example we'll use a hardcoded actor, but you could randomize)
export const getTargetActor = async (): Promise<Actor> => {
  // Jim Parsons
  const targetActorId = 1397778;
  return rateLimitRequest(async () => {
    const response = await tmdbApi.get(`/person/${targetActorId}`);
    return {
      id: response.data.id,
      name: response.data.name,
      profile_path: response.data.profile_path,
    };
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