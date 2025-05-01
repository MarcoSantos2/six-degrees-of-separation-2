import axios from 'axios';
import { Actor, Movie } from '../types';

const api = axios.create({
  baseURL: '/api',
});

// Add request/response logging
api.interceptors.request.use(request => {
  console.log('API Request:', {
    method: request.method?.toUpperCase(),
    url: request.url,
    baseURL: request.baseURL
  });
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url
    });
    return response;
  },
  error => {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export const getTargetActor = async (): Promise<Actor> => {
  try {
    console.log('Fetching target actor...');
    const response = await api.get<Actor>('/target');
    console.log('Target actor response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching target actor:', error);
    throw error;
  }
};

export const getMoviesByActor = async (actorId: number): Promise<Movie[]> => {
  try {
    const response = await api.get<Movie[]>(`/movies?actorId=${actorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movies for actor ${actorId}:`, error);
    throw error;
  }
};

export const getCastByMovie = async (movieId: number): Promise<Actor[]> => {
  try {
    const response = await api.get<Actor[]>(`/cast?movieId=${movieId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching cast for movie ${movieId}:`, error);
    throw error;
  }
};

export const getPopularActors = async (filterByWestern: boolean = true): Promise<Actor[]> => {
  try {
    const response = await api.get<Actor[]>(`/popular-actors?filterByWestern=${filterByWestern}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular actors:', error);
    throw error;
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await api.get<Movie[]>(`/search-movies?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching movies with query "${query}":`, error);
    throw error;
  }
}; 