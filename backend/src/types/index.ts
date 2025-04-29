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
  adult?: boolean;
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

export interface ReleaseDate {
  certification: string;
  release_date: string;
  type: number;
}

export interface ReleaseDatesResult {
  iso_3166_1: string;
  release_dates: ReleaseDate[];
}

export interface MovieDetails {
  release_dates: {
    results: ReleaseDatesResult[];
  };
} 