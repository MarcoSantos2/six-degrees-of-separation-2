export type MediaType = 'movie' | 'tv';

export type MediaFilter = 'ALL_MEDIA' | 'MOVIES_ONLY' | 'TV_ONLY';

export interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
}

export interface Media {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string | null;
  media_type: MediaType;
}

export interface GameSettings {
  filterByWestern: boolean;
  theme: 'light' | 'dark';
  maxHops: number;
  maxHopsEnabled: boolean;
  timerEnabled: boolean;
  timerDuration: number;
  mediaFilter: MediaFilter;
}

export interface TimerState {
  remainingTime: number;
  isRunning: boolean;
  isPaused: boolean;
}

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

export interface SearchResult {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  known_for: Array<{
    id: number;
    title?: string;
    name?: string;
    media_type: 'movie' | 'tv';
    poster_path: string | null;
  }>;
} 