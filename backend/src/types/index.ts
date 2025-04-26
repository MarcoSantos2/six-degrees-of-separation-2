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

export interface Cast {
  cast: Actor[];
}

export interface MovieCredits {
  cast: Movie[];
}

export interface TMDBError {
  status_message: string;
  status_code: number;
} 