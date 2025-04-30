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

interface PopularActorsResponse {
  results: {
    id: number;
    name: string;
    profile_path: string;
  }[];
}

export const getPopularActors = async (): Promise<Actor[]> => {
  return rateLimitRequest(async () => {
    const randomPage = Math.floor(Math.random() * 20) + 1;
    const response = await tmdbApi.get<PopularActorsResponse>(`/person/popular?page=${randomPage}`);
    return response.data.results.map(actor => ({
      id: actor.id,
      name: actor.name,
      profile_path: actor.profile_path,
    }));
  });
};

// Get random target actor
export const getTargetActor = async (): Promise<Actor> => {
  return rateLimitRequest(async () => {
    try {
      console.log('Fetching popular actors...');
      // Get popular actors
      const popularActors = await getPopularActors();
      console.log('Popular actors fetched:', popularActors.length);
      
      // Choose random actor from the list
      const randomActor = popularActors[Math.floor(Math.random() * popularActors.length)];
      console.log('Selected random actor:', randomActor.name);
      
      // Get additional details for the actor
      console.log('Fetching actor details for:', randomActor.id);
      const response = await tmdbApi.get(`/person/${randomActor.id}`);
      console.log('Actor details received:', response.data.name);
      
      return {
        id: response.data.id,
        name: response.data.name,
        profile_path: response.data.profile_path,
      };
    } catch (error: any) {
      console.error('TMDB API error:', error.message);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
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

interface ActorImage {
  file_path: string;
  vote_count: number;
}

interface ActorImages {
  profiles: ActorImage[];
}

export const getActorImages = async (actorId: number): Promise<ActorImage[]> => {
  return rateLimitRequest(async () => {
    const response = await tmdbApi.get<ActorImages>(`/person/${actorId}/images`);
    return response.data.profiles;
  });
};

export const getCastByMovie = async (movieId: number): Promise<Actor[]> => {
  return rateLimitRequest(async () => {
    const response = await tmdbApi.get<Cast>(`/movie/${movieId}/credits`);
    const cast = response.data.cast;
    
    // Fetch images for each actor
    const actorsWithImages = await Promise.all(
      cast.map(async (actor) => {
        try {
          const images = await getActorImages(actor.id);
          return {
            id: actor.id,
            name: actor.name,
            profile_path: actor.profile_path,
            images: images
          };
        } catch (error) {
          console.error(`Failed to fetch images for actor ${actor.id}:`, error);
          return {
            id: actor.id,
            name: actor.name,
            profile_path: actor.profile_path,
            images: []
          };
        }
      })
    );
    
    return actorsWithImages;
  });
};

interface MovieSearchResponse {
  results: {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
  }[];
}

export const searchMovies = async (query: string): Promise<Movie[]> => {
  return rateLimitRequest(async () => {
    const response = await tmdbApi.get<MovieSearchResponse>(`/search/movie`, {
      params: {
        query,
        include_adult: false,
      },
    });
    
    return response.data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    }));
  });
}; 