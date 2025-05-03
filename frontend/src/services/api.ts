import { Actor, Media, MediaFilter, MediaType } from '../types';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Get target actor
export const getTargetActor = async (): Promise<Actor> => {
  const response = await fetch(`${API_BASE_URL}/target`);
  if (!response.ok) throw new Error('Failed to fetch target actor');
  return response.json();
};

// Get media by actor
export const getMediaByActor = async (actorId: number, mediaFilter: MediaFilter = 'ALL_MEDIA'): Promise<Media[]> => {
  const response = await fetch(`${API_BASE_URL}/media?actorId=${actorId}&mediaFilter=${mediaFilter}`);
  return handleResponse(response);
};

// Get cast by media
export const getCastByMedia = async (mediaId: number, mediaType: MediaType): Promise<Actor[]> => {
  const response = await fetch(`${API_BASE_URL}/cast?mediaId=${mediaId}&mediaType=${mediaType}`);
  if (!response.ok) throw new Error('Failed to fetch cast');
  return response.json();
};

// Get popular actors
export const getPopularActors = async (filterByWestern: boolean = true, mediaFilter: MediaFilter = 'ALL_MEDIA'): Promise<Actor[]> => {
  const response = await axios.get(`${API_BASE_URL}/popular-actors`, {
    params: {
      filterByWestern,
      mediaFilter
    }
  });
  return response.data;
};

// Search media
export const searchMedia = async (query: string, mediaFilter: MediaFilter = 'ALL_MEDIA'): Promise<Media[]> => {
  const response = await fetch(`${API_BASE_URL}/search-media?query=${encodeURIComponent(query)}&mediaFilter=${mediaFilter}`);
  if (!response.ok) throw new Error('Failed to search media');
  return response.json();
}; 