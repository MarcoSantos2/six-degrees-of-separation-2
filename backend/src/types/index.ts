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
  genre_ids?: number[];
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

// Allowed TV show genres
export const ALLOWED_TV_GENRES = [
  10759, // Action & Adventure
  16,    // Animation
  35,    // Comedy
  80,    // Crime
  18,    // Drama
  10765, // Sci-Fi & Fantasy
  37,    // Western
  9648   // Mystery
];

// Genres to exclude (even if they have allowed genres)
export const EXCLUDED_TV_GENRES = [
  10767, // Talk
  10764, // Reality
  10763, // News
  10766, // Soap
  10762, // Kids
  10751, // Family
  99,    // Documentary
  10768  // War & Politics
];

// Specific TV shows to exclude by ID (regardless of their genres)
export const EXCLUDED_TV_SHOW_IDS = [ // TODO: add more shows to this list as you find them
  122843, // Honest Trailers
]; 