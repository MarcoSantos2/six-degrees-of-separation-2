export interface ActorImage {
  file_path: string;
  vote_count: number;
}

export interface Actor {
  id: number;
  name: string;
  profile_path: string;
  images?: ActorImage[];
  known_for_department?: string;
  place_of_birth?: string;
}

export type MediaType = 'movie' | 'tv';

export interface Media {
  id: number;
  title: string;
  name?: string; // For TV shows
  original_title?: string; // For movies
  original_name?: string; // For TV shows
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date?: string; // For movies
  first_air_date?: string; // For TV shows
  media_type: MediaType;
  overview?: string;
  popularity?: number;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
}

// For backward compatibility
export interface Movie extends Omit<Media, 'media_type'> {
  media_type: 'movie';
  original_title: string;
  release_date: string;
}

export interface TVShow extends Omit<Media, 'media_type'> {
  media_type: 'tv';
  name: string;
  original_name: string;
  first_air_date: string;
}

export interface GamePath {
  actor: Actor;
  media?: Media;
}

export type MediaFilter = 'MOVIES_ONLY' | 'TV_ONLY' | 'ALL_MEDIA';

export interface GameState {
  targetActor: Actor | null;
  currentPath: Array<{
    actor: Actor;
    media?: Media;
  }>;
  maxHops: number;
  gameStatus: 'not_started' | 'in_progress' | 'won' | 'lost';
  settings: {
    filterByWestern: boolean;
    theme: 'light' | 'dark';
    maxHops: number;
    maxHopsEnabled: boolean;
    timerEnabled: boolean;
    timerDuration: number;
    mediaFilter: MediaFilter;
  };
  timer: {
    remainingTime: number;
    isRunning: boolean;
    isPaused: boolean;
  };
} 