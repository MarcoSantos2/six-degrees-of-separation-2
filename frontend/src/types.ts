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

export interface GameState {
  targetActor: Actor | null;
  currentPath: Array<{ actor?: Actor; movie?: Movie }>;
  maxHops: number;
  gameStatus: 'not_started' | 'in_progress' | 'won' | 'lost';
  settings: {
    filterByWestern: boolean;
    theme: 'light' | 'dark';
    maxHops: number;
    timerEnabled: boolean;
    timerDuration: number;
  };
  timer: {
    remainingTime: number;
    isRunning: boolean;
  };
} 