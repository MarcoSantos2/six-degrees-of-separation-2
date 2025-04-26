export interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
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
  currentPath: GamePath[];
  maxHops: number;
  gameStatus: 'not_started' | 'in_progress' | 'won' | 'lost';
} 