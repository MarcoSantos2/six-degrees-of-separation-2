export interface ActorImage {
  file_path: string;
  vote_count: number;
}

export interface Actor {
  id: number;
  name: string;
  profile_path: string;
  images?: ActorImage[];
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

export interface GamePath {
  actor: Actor;
  movie?: Movie;
}

export interface GameState {
  targetActor: Actor | null;
  currentPath: Array<{
    actor: Actor;
    movie?: Movie;
  }>;
  maxHops: number;
  gameStatus: 'not_started' | 'in_progress' | 'won' | 'lost';
  settings: {
    filterByWestern: boolean;
    theme: 'light' | 'dark';
    maxHops: number;
  };
} 