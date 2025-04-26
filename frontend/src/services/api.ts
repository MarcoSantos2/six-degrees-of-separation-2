import axios from 'axios';
import { Actor, Movie } from '../types';

const api = axios.create({
  baseURL: '/api',
});

export const getTargetActor = async (): Promise<Actor> => {
  const response = await api.get<Actor>('/target');
  return response.data;
};

export const getMoviesByActor = async (actorId: number): Promise<Movie[]> => {
  const response = await api.get<Movie[]>(`/movies?actorId=${actorId}`);
  return response.data;
};

export const getCastByMovie = async (movieId: number): Promise<Actor[]> => {
  const response = await api.get<Actor[]>(`/cast?movieId=${movieId}`);
  return response.data;
}; 