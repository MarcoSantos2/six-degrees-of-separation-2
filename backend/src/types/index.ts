export interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  place_of_birth?: string;
}

export type MediaType = 'movie' | 'tv';

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  media_type: 'movie';
}

export interface TVShow {
  id: number;
  name: string;
  first_air_date: string;
  poster_path: string | null;
  media_type: 'tv';
}

export type Media = Movie | TVShow;

export type MediaFilter = 'ALL_MEDIA' | 'MOVIES_ONLY' | 'TV_ONLY';

export interface Cast {
  cast: Array<{
    id: number;
    name: string;
    profile_path: string | null;
  }>;
}

export interface MovieCredits {
  cast: Array<{
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
  }>;
}

export interface TVCredits {
  cast: Array<{
    id: number;
    name: string;
    poster_path: string | null;
    first_air_date: string;
  }>;
}

export interface ActorImage {
  file_path: string;
  vote_count: number;
}

export interface ActorImages {
  profiles: ActorImage[];
}

export interface MediaCredits {
  cast: Media[];
  crew?: {
    id: number;
    name: string;
    profile_path: string | null;
    job: string;
    department: string;
    media_type: MediaType;
  }[];
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

export interface TVDetails {
  content_ratings: {
    results: ReleaseDatesResult[];
  };
} 