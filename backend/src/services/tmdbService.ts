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

// List of Western country codes and their common names
const WESTERN_COUNTRIES = {
  'USA': ['USA', 'UNITED STATES', 'UNITED STATES OF AMERICA', 'U.S.A.', 'U.S.'],
  'GB': ['GB', 'UK', 'UNITED KINGDOM', 'GREAT BRITAIN', 'ENGLAND'],
  'CA': ['CA', 'CANADA'],
  'AU': ['AU', 'AUSTRALIA'],
  'NZ': ['NZ', 'NEW ZEALAND'],
  'IE': ['IE', 'IRELAND'],
  'FR': ['FR', 'FRANCE'],
  'DE': ['DE', 'GERMANY'],
  'IT': ['IT', 'ITALY'],
  'ES': ['ES', 'SPAIN'],
  'PT': ['PT', 'PORTUGAL'],
  'NL': ['NL', 'NETHERLANDS', 'HOLLAND'],
  'BE': ['BE', 'BELGIUM'],
  'SE': ['SE', 'SWEDEN'],
  'NO': ['NO', 'NORWAY'],
  'DK': ['DK', 'DENMARK'],
  'FI': ['FI', 'FINLAND'],
  'CH': ['CH', 'SWITZERLAND'],
  'AT': ['AT', 'AUSTRIA'],
  'MX': ['MX', 'MEXICO']
};

interface PopularActorsResponse {
  results: {
    id: number;
    name: string;
    profile_path: string;
    known_for_department: string;
  }[];
}

interface ActorDetails {
  id: number;
  name: string;
  profile_path: string;
  place_of_birth: string;
  known_for_department: string;
}

export const getPopularActors = async (filterByWestern: boolean = true): Promise<Actor[]> => {
  return rateLimitRequest(async () => {
    const MAX_ACTORS = 20;
    const allActors: Actor[] = [];
    let currentPage = Math.floor(Math.random() * 10) + 1; // Random page between 1 and 10
    
    while (allActors.length < MAX_ACTORS && currentPage <= 11) {
      console.log(`Fetching page ${currentPage}...`);
      const response = await tmdbApi.get<PopularActorsResponse>(`/person/popular`, {
        params: {
          page: currentPage,
        }
      });
      
      // Get details for each actor to check their nationality
      const actorDetailsPromises = response.data.results
        .filter(actor => 
          actor.profile_path && // Must have a profile picture
          actor.known_for_department === 'Acting' // Must be primarily an actor
        )
        .map(async (actor) => {
          try {
            const details = await tmdbApi.get<ActorDetails>(`/person/${actor.id}`);
            return {
              actor,
              details: details.data
            };
          } catch (error) {
            console.error(`Error fetching details for actor ${actor.id}:`, error);
            return null;
          }
        });

      const actorDetails = await Promise.all(actorDetailsPromises);
      
      // Filter actors based on their place of birth if filterByWestern is true
      const validActors = actorDetails
        .filter(result => {
          if (!result) return false;
          const { details, actor } = result;
          
          // Debug logging
          console.log(`Checking actor: ${actor.name}`);
          console.log(`Place of birth: ${details.place_of_birth}`);
          
          if (!details.place_of_birth) {
            console.log(`No place of birth for ${actor.name}, skipping`);
            return false;
          }

          // If not filtering by Western countries, accept all actors with valid place of birth
          if (!filterByWestern) {
            return true;
          }

          // Split place of birth into parts (city, state, country)
          const placeParts = details.place_of_birth.split(',').map(part => part.trim().toUpperCase());
          console.log('Place parts:', placeParts);

          // Check if any part matches a Western country
          const isWestern = Object.values(WESTERN_COUNTRIES).some(countryNames => 
            countryNames.some(countryName => 
              placeParts.some(part => part === countryName)
            )
          );

          console.log(`Is Western: ${isWestern}`);
          return isWestern;
        })
        .map(result => ({
          id: result!.actor.id,
          name: result!.actor.name,
          profile_path: result!.actor.profile_path,
    }));
      
      console.log(`Found ${validActors.length} valid actors on page ${currentPage}`);
      allActors.push(...validActors);
      currentPage++;
    }
    
    // If we have more than 20 actors, randomly select 20
    if (allActors.length > MAX_ACTORS) {
      const selectedActors = allActors
        .sort(() => Math.random() - 0.5) // Shuffle the array
        .slice(0, MAX_ACTORS); // Take first 20
      
      console.log('Final selected actors:', selectedActors.map(a => a.name));
      return selectedActors;
    }
    
    console.log('Final actors (less than 20):', allActors.map(a => a.name));
    return allActors;
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