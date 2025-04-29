import axios from 'axios';
import { Actor, Movie } from '../types';

const api = axios.create({
  baseURL: '/api',
});

// Add request/response logging
api.interceptors.request.use(request => {
  return request;
});

api.interceptors.response.use(
  response => {
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
    const response = await api.get<Actor>('/target');
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

export const getPopularActors = async (): Promise<Actor[]> => {
  const response = await fetch('/api/popular-actors');
  if (!response.ok) {
    throw new Error('Failed to fetch popular actors');
  }
  return response.json();
}; 