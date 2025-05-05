import axios from 'axios';
import dotenv from 'dotenv';
import { Actor, Cast, MovieCredits, Movie, Media, MediaType, TVCredits, TVShow, MediaFilter, ALLOWED_TV_GENRES, EXCLUDED_TV_GENRES, EXCLUDED_TV_SHOW_IDS } from '../types';
import { rateLimitRequest } from './rateLimiter';
import { cache } from './cache';

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_BASE_URL = process.env.TMDB_API_BASE_URL;

if (!TMDB_API_KEY) {
  throw new Error('TMDB_API_KEY is not defined in environment variables');
}

const tmdbApi = axios.create({
  baseURL: TMDB_API_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US',
  },
});

// List of Western country codes and their common names
const WESTERN_COUNTRIES = {
  'USA': ['USA', 'UNITED STATES', 'UNITED STATES OF AMERICA', 'U.S.A.', 'U.S.'],
  'GB': ['GB', 'UK', 'UNITED KINGDOM', 'GREAT BRITAIN', 'ENGLAND'],
  'CA': ['CA', 'CANADA'],
  'AU': ['AU', 'AUSTRALIA'],
  'NZ': ['NZ', 'NEW ZEALAND'],
  'IE': ['IE', 'IRELAND'],
  'FR': ['FR', 'FRANCE'],
  'DE': ['DE', 'GERMANY'],
  'IT': ['IT', 'ITALY'],
  'ES': ['ES', 'SPAIN'],
  'PT': ['PT', 'PORTUGAL'],
  'NL': ['NL', 'NETHERLANDS', 'HOLLAND'],
  'BE': ['BE', 'BELGIUM'],
  'SE': ['SE', 'SWEDEN'],
  'NO': ['NO', 'NORWAY'],
  'DK': ['DK', 'DENMARK'],
  'FI': ['FI', 'FINLAND'],
  'CH': ['CH', 'SWITZERLAND'],
  'AT': ['AT', 'AUSTRIA'],
  'MX': ['MX', 'MEXICO']
};

interface PopularActorsResponse {
  results: {
    id: number;
    name: string;
    profile_path: string;
    known_for_department: string;
    popularity: number;
  }[];
}

interface ActorDetails {
  id: number;
  name: string;
  profile_path: string;
  place_of_birth: string;
  known_for_department: string;
  popularity: number;
}

export const getPopularActors = async (filterByWestern: boolean = true, mediaFilter: MediaFilter = 'ALL_MEDIA'): Promise<Actor[]> => {
  return rateLimitRequest(async () => {
    const MAX_ACTORS = 20;
    const allActors: Actor[] = [];
    let currentPage = Math.floor(Math.random() * 10) + 1; // Random page between 1 and 10
    
    while (allActors.length < MAX_ACTORS && currentPage <= 11) {
      console.log(`Fetching page ${currentPage}...`);
      const response = await tmdbApi.get<PopularActorsResponse>(`/person/popular`, {
        params: {
          page: currentPage,
        }
      });
      
      // Get details and credits for each actor
      const actorDetailsPromises = response.data.results
        .filter(actor => 
          actor.profile_path && // Must have a profile picture
          actor.known_for_department === 'Acting' // Must be primarily an actor
        )
        .map(async (actor) => {
          try {
            const [details, movieCredits, tvCredits] = await Promise.all([
              tmdbApi.get<ActorDetails>(`/person/${actor.id}`),
              tmdbApi.get<MovieCreditsResponse>(`/person/${actor.id}/movie_credits`),
              tmdbApi.get<TVCreditsResponse>(`/person/${actor.id}/tv_credits`)
            ]);
            return {
              actor,
              details: details.data,
              movieCredits: movieCredits.data.cast,
              tvCredits: tvCredits.data.cast
            };
          } catch (error) {
            console.error(`Error fetching details for actor ${actor.id}:`, error);
            return null;
          }
        });

      const actorDetails = await Promise.all(actorDetailsPromises);
      
      // Filter actors based on their place of birth and media type
      const validActors = actorDetails
        .filter(result => {
          if (!result) return false;
          const { details, actor, movieCredits, tvCredits } = result;
          
          // Debug logging
          console.log(`Checking actor: ${actor.name}`);
          console.log(`Place of birth: ${details.place_of_birth}`);
          
          if (!details.place_of_birth) {
            console.log(`No place of birth for ${actor.name}, skipping`);
            return false;
          }

          // Check if actor has the required media type credits
          const hasMovies = movieCredits.length > 0;
          const hasTVShows = tvCredits.length > 0;
          
          let hasRequiredMedia = true;
          if (mediaFilter === 'MOVIES_ONLY') {
            hasRequiredMedia = hasMovies;
          } else if (mediaFilter === 'TV_ONLY') {
            hasRequiredMedia = hasTVShows;
          } else {
            hasRequiredMedia = hasMovies || hasTVShows;
          }

          if (!hasRequiredMedia) {
            console.log(`${actor.name} doesn't have required media type credits, skipping`);
            return false;
          }

          // If not filtering by Western countries, accept all actors with valid place of birth
          if (!filterByWestern) {
            return true;
          }

          // Split place of birth into parts (city, state, country)
          const placeParts = details.place_of_birth.split(',').map(part => part.trim().toUpperCase());
          console.log('Place parts:', placeParts);

          // Check if any part matches a Western country
          const isWestern = Object.values(WESTERN_COUNTRIES).some(countryNames => 
            countryNames.some(countryName => 
              placeParts.some(part => part === countryName)
            )
          );

          console.log(`Is Western: ${isWestern}`);
          return isWestern;
        })
        .map(result => ({
          id: result!.actor.id,
          name: result!.actor.name,
          profile_path: result!.actor.profile_path,
          known_for_department: result!.actor.known_for_department,
          popularity: result!.actor.popularity
        }));
      
      console.log(`Found ${validActors.length} valid actors on page ${currentPage}`);
      allActors.push(...validActors);
      currentPage++;
    }
    
    // If we have more than 20 actors, randomly select 20
    if (allActors.length > MAX_ACTORS) {
      const selectedActors = allActors
        .sort(() => Math.random() - 0.5) // Shuffle the array
        .slice(0, MAX_ACTORS); // Take first 20
      
      console.log('Final selected actors:', selectedActors.map(a => a.name));
      return selectedActors;
    }
    
    console.log('Final actors (less than 20):', allActors.map(a => a.name));
    return allActors;
  });
};

// Get random target actor
export const getTargetActor = async (): Promise<Actor> => {
  return rateLimitRequest(async () => {
    try {
      console.log('Fetching popular actors...');
      // Get popular actors
      const popularActors = await getPopularActors();
      console.log('Popular actors fetched:', popularActors.length);
      
      // Choose random actor from the list
      const randomActor = popularActors[Math.floor(Math.random() * popularActors.length)];
      console.log('Selected random actor:', randomActor.name);
      
      // Get additional details for the actor
      console.log('Fetching actor details for:', randomActor.id);
      const response = await tmdbApi.get(`/person/${randomActor.id}`);
      console.log('Actor details received:', response.data.name);
      
      return {
        id: response.data.id,
        name: response.data.name,
        profile_path: response.data.profile_path,
        known_for_department: response.data.known_for_department,
        popularity: response.data.popularity
      };
    } catch (error: any) {
      console.error('TMDB API error:', error.message);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      }
      throw error;
    }
  });
};

interface MovieCreditsResponse {
  cast: {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
  }[];
}

interface TVCreditsResponse {
  cast: {
    id: number;
    name: string;
    poster_path: string | null;
    first_air_date: string;
    genre_ids?: number[];
  }[];
}

export const getMediaByActor = async (actorId: number, mediaFilter: MediaFilter = 'ALL_MEDIA'): Promise<Media[]> => {
  return rateLimitRequest(async () => {
    // Check cache first
    const cacheKey = `media_${actorId}_${mediaFilter}`;
    const cachedData = cache.get<Media[]>(cacheKey);
    if (cachedData) {
      console.log('Returning cached media for actor:', actorId);
      return cachedData;
    }

    const media: Media[] = [];

    // Fetch movies if needed
    if (mediaFilter === 'ALL_MEDIA' || mediaFilter === 'MOVIES_ONLY') {
      const movieResponse = await tmdbApi.get<MovieCreditsResponse>(`/person/${actorId}/movie_credits`);
      const movies = movieResponse.data.cast.map((movie) => ({
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        media_type: 'movie' as const,
      }));
      media.push(...movies);
    }

    // Fetch TV shows if needed
    if (mediaFilter === 'ALL_MEDIA' || mediaFilter === 'TV_ONLY') {
      console.log('Fetching TV credits for actor:', actorId);
      const tvResponse = await tmdbApi.get<TVCreditsResponse>(`/person/${actorId}/tv_credits`);
      console.log(`Found ${tvResponse.data.cast.length} TV shows in credits`);
      
      const tvShows = tvResponse.data.cast
        .filter(show => {
          console.log(`\nChecking TV show: ${show.name}`);
          // Check for excluded show ID first
          if (EXCLUDED_TV_SHOW_IDS.includes(show.id)) {
            console.log('Show is in excluded list, will be filtered out');
            return false;
          }
          // If no genre_ids are provided, fetch them
          if (!show.genre_ids) {
            console.log('No genre_ids available, will fetch details');
            return true; // Include it for now, we'll filter after fetching details
          }
          // Check for excluded genres
          const hasExcludedGenre = show.genre_ids.some(genreId => EXCLUDED_TV_GENRES.includes(genreId));
          if (hasExcludedGenre) {
            console.log('Has excluded genre, will be filtered out');
            return false;
          }
          // Then check for allowed genres
          const hasAllowedGenre = show.genre_ids.some(genreId => ALLOWED_TV_GENRES.includes(genreId));
          console.log('Genre IDs:', show.genre_ids);
          console.log('Has allowed genre:', hasAllowedGenre);
          return hasAllowedGenre;
        })
        .map(async (show) => {
          // If we don't have genre_ids, fetch the show details
          if (!show.genre_ids) {
            try {
              console.log(`Fetching details for TV show: ${show.name}`);
              const details = await tmdbApi.get(`/tv/${show.id}`);
              show.genre_ids = details.data.genres.map((g: { id: number }) => g.id);
              console.log(`Fetched genres for ${show.name}:`, show.genre_ids);
            } catch (error) {
              console.error(`Failed to fetch details for TV show ${show.id}:`, error);
              return null;
            }
          }
          return {
            id: show.id,
            name: show.name,
            first_air_date: show.first_air_date,
            poster_path: show.poster_path,
            media_type: 'tv' as const,
            genre_ids: show.genre_ids
          } as TVShow;
        });

      // Wait for all TV show details to be fetched
      console.log('\nResolving TV show details...');
      const resolvedShows = await Promise.all(tvShows);
      console.log(`Resolved ${resolvedShows.length} TV shows`);
      
      const filteredShows = resolvedShows
        .filter((show): show is TVShow => {
          if (show === null) {
            console.log('Skipping null show');
            return false;
          }
          // Check for excluded show ID first
          if (EXCLUDED_TV_SHOW_IDS.includes(show.id)) {
            console.log(`\n${show.name} is in excluded list, filtering out`);
            return false;
          }
          // Check for excluded genres
          const hasExcludedGenre = show.genre_ids?.some(genreId => EXCLUDED_TV_GENRES.includes(genreId)) === true;
          if (hasExcludedGenre) {
            console.log(`\n${show.name} has excluded genre, filtering out`);
            return false;
          }
          // Then check for allowed genres
          const hasAllowedGenre = show.genre_ids?.some(genreId => ALLOWED_TV_GENRES.includes(genreId)) === true;
          console.log(`\nFinal check for ${show.name}:`);
          console.log('Genre IDs:', show.genre_ids);
          console.log('Has allowed genre:', hasAllowedGenre);
          return hasAllowedGenre;
        });
      
      console.log(`\nFinal filtered TV shows: ${filteredShows.length}`);
      filteredShows.forEach(show => console.log(`- ${show.name} (Genres: ${show.genre_ids?.join(', ')})`));
      
      media.push(...filteredShows);
    }

    cache.set(cacheKey, media);
    return media;
  });
};

interface ActorImage {
  file_path: string;
  vote_count: number;
}

interface ActorImages {
  profiles: ActorImage[];
}

export const getActorImages = async (actorId: number): Promise<ActorImage[]> => {
  return rateLimitRequest(async () => {
    const response = await tmdbApi.get<ActorImages>(`/person/${actorId}/images`);
    return response.data.profiles;
  });
};

export const getCastByMedia = async (mediaId: number, mediaType: MediaType): Promise<Actor[]> => {
  return rateLimitRequest(async () => {
    // Check cache first
    const cacheKey = `cast_${mediaType}_${mediaId}`;
    const cachedData = cache.get<Actor[]>(cacheKey);
    if (cachedData) {
      console.log('Returning cached cast for media:', mediaId);
      return cachedData;
    }

    if (mediaType === 'movie') {
      // Movie: use existing logic
      const response = await tmdbApi.get<Cast>(`/movie/${mediaId}/credits`);
      const cast = response.data.cast;
      const actorsWithImages = await Promise.all(
        cast.map(async (actor) => {
          try {
            const images = await getActorImages(actor.id);
            return {
              id: actor.id,
              name: actor.name,
              profile_path: actor.profile_path,
              known_for_department: 'Acting',
              popularity: 0
            };
          } catch (error) {
            console.error(`Failed to fetch images for actor ${actor.id}:`, error);
            return {
              id: actor.id,
              name: actor.name,
              profile_path: actor.profile_path,
              known_for_department: 'Acting',
              popularity: 0
            };
          }
        })
      );
      cache.set(cacheKey, actorsWithImages);
      return actorsWithImages;
    }

    // TV: fetch main cast first, then all episodes cast
    console.log(`\n[TV] [${mediaId}] ===== STARTING TV CAST FETCH =====`);
    
    // Get main series cast first
    console.log(`[TV] [${mediaId}] Fetching main series cast...`);
    const mainCastResponse = await tmdbApi.get<Cast>(`/tv/${mediaId}/credits`);
    const mainCast = mainCastResponse.data.cast || [];
    console.log(`[TV] [${mediaId}] Main cast response:`, JSON.stringify(mainCastResponse.data, null, 2));
    console.log(`[TV] [${mediaId}] Found ${mainCast.length} actors in main cast.`);
    console.log('Main cast names:', mainCast.map(a => a.name).join(', '));
    
    // Then get episode-specific cast
    console.log(`\n[TV] [${mediaId}] Fetching show details...`);
    const showDetails = await tmdbApi.get(`/tv/${mediaId}`);
    const seasons = showDetails.data.seasons || [];
    console.log(`[TV] [${mediaId}] Show details:`, JSON.stringify(showDetails.data, null, 2));
    console.log(`[TV] [${mediaId}] Found ${seasons.length} seasons.`);
    let allEpisodes: { season_number: number, episode_number: number }[] = [];
    
    for (const season of seasons) {
      if (season.season_number === 0) {
        console.log(`[TV] [${mediaId}] Skipping season 0 (specials)`);
        continue;
      }
      console.log(`\n[TV] [${mediaId}] Fetching episodes for season ${season.season_number}...`);
      const seasonDetails = await tmdbApi.get(`/tv/${mediaId}/season/${season.season_number}`);
      const episodes = seasonDetails.data.episodes || [];
      console.log(`[TV] [${mediaId}] Season ${season.season_number} has ${episodes.length} episodes`);
      allEpisodes.push(...episodes.map((ep: any) => ({ 
        season_number: season.season_number, 
        episode_number: ep.episode_number 
      })));
    }
    
    console.log(`\n[TV] [${mediaId}] Total episodes to fetch credits for: ${allEpisodes.length}`);
    if (allEpisodes.length > 50) {
      console.log(`[TV] [${mediaId}] This may take a while. Fetching credits for ${allEpisodes.length} episodes...`);
    }
    
    const episodeCredits = await Promise.all(
      allEpisodes.map(async ({ season_number, episode_number }) => {
        try {
          console.log(`[TV] [${mediaId}] Fetching credits for S${season_number}E${episode_number}...`);
          const creditsResp = await tmdbApi.get(`/tv/${mediaId}/season/${season_number}/episode/${episode_number}/credits`);
          const cast = creditsResp.data.cast || [];
          const guestStars = creditsResp.data.guest_stars || [];
          console.log(`[TV] [${mediaId}] S${season_number}E${episode_number} has ${cast.length} cast members and ${guestStars.length} guest stars`);
          return [...cast, ...guestStars];
        } catch (err) {
          console.error(`[TV] [${mediaId}] Failed to fetch credits for S${season_number}E${episode_number}:`, err);
          return [];
        }
      })
    );
    
    // Combine main cast with episode casts and deduplicate
    console.log(`\n[TV] [${mediaId}] Combining and deduplicating casts...`);
    const allActors = [...mainCast, ...episodeCredits.flat()];
    console.log(`[TV] [${mediaId}] Total actors before deduplication: ${allActors.length}`);
    
    // Create a map to store unique actors, preserving the first occurrence of each actor
    const uniqueActorsMap = new Map<number, any>();
    
    // First add main cast members (they take precedence)
    for (const actor of mainCast) {
      uniqueActorsMap.set(actor.id, actor);
    }
    
    // Then add episode cast members if they're not already in the map
    for (const actor of episodeCredits.flat()) {
      if (!uniqueActorsMap.has(actor.id)) {
        uniqueActorsMap.set(actor.id, actor);
      }
    }
    
    const uniqueActors = Array.from(uniqueActorsMap.values());
    console.log(`[TV] [${mediaId}] Found ${uniqueActors.length} unique actors after deduplication (including main cast).`);
    console.log('Unique actor names:', uniqueActors.map(a => a.name).join(', '));
    
    const actorsWithImages = await Promise.all(
      uniqueActors.map(async (actor) => {
        try {
          const images = await getActorImages(actor.id);
          return {
            id: actor.id,
            name: actor.name,
            profile_path: actor.profile_path,
            known_for_department: 'Acting',
            popularity: actor.popularity || 0
          };
        } catch (error) {
          return {
            id: actor.id,
            name: actor.name,
            profile_path: actor.profile_path,
            known_for_department: 'Acting',
            popularity: actor.popularity || 0
          };
        }
      })
    );
    
    console.log(`\n[TV] [${mediaId}] ===== FINISHED TV CAST FETCH =====`);
    console.log(`[TV] [${mediaId}] Returning ${actorsWithImages.length} actors.`);
    cache.set(cacheKey, actorsWithImages);
    return actorsWithImages;
  });
};

interface MovieSearchResponse {
  results: {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
  }[];
}

interface TVSearchResponse {
  results: {
    id: number;
    name: string;
    poster_path: string | null;
    first_air_date: string;
  }[];
}

export const searchMedia = async (query: string, mediaFilter: MediaFilter = 'ALL_MEDIA'): Promise<Media[]> => {
  return rateLimitRequest(async () => {
    const media: Media[] = [];

    // Search movies if needed
    if (mediaFilter === 'ALL_MEDIA' || mediaFilter === 'MOVIES_ONLY') {
      const movieResponse = await tmdbApi.get<MovieSearchResponse>(`/search/movie`, {
        params: {
          query,
          include_adult: false,
        },
      });
      const movies = movieResponse.data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        media_type: 'movie' as const,
      }));
      media.push(...movies);
    }

    // Search TV shows if needed
    if (mediaFilter === 'ALL_MEDIA' || mediaFilter === 'TV_ONLY') {
      console.log('\nSearching TV shows for query:', query);
      const tvResponse = await tmdbApi.get<TVSearchResponse>(`/search/tv`, {
        params: {
          query,
          include_adult: false,
        },
      });
      console.log(`Found ${tvResponse.data.results.length} TV shows in search results`);
      
      // Fetch details for each TV show to get genres
      const tvShows = await Promise.all(
        tvResponse.data.results.map(async (show) => {
          try {
            console.log(`\nFetching details for TV show: ${show.name}`);
            const details = await tmdbApi.get(`/tv/${show.id}`);
            const genreIds = details.data.genres.map((g: { id: number }) => g.id);
            console.log(`Genres for ${show.name}:`, genreIds);
            return {
              id: show.id,
              name: show.name,
              first_air_date: show.first_air_date,
              poster_path: show.poster_path,
              media_type: 'tv' as const,
              genre_ids: genreIds
            } as TVShow;
          } catch (error) {
            console.error(`Failed to fetch details for TV show ${show.id}:`, error);
            return null;
          }
        })
      );

      // Filter shows by allowed genres
      console.log('\nFiltering TV shows by allowed genres...');
      const filteredShows = tvShows
        .filter((show): show is TVShow => {
          if (show === null) {
            console.log('Skipping null show');
            return false;
          }
          // Check for excluded show ID first
          if (EXCLUDED_TV_SHOW_IDS.includes(show.id)) {
            console.log(`\n${show.name} is in excluded list, filtering out`);
            return false;
          }
          // Check for excluded genres
          const hasExcludedGenre = show.genre_ids?.some(genreId => EXCLUDED_TV_GENRES.includes(genreId)) === true;
          if (hasExcludedGenre) {
            console.log(`\n${show.name} has excluded genre, filtering out`);
            return false;
          }
          // Then check for allowed genres
          const hasAllowedGenre = show.genre_ids?.some(genreId => ALLOWED_TV_GENRES.includes(genreId)) === true;
          console.log(`\nChecking ${show.name}:`);
          console.log('Genre IDs:', show.genre_ids);
          console.log('Has allowed genre:', hasAllowedGenre);
          return hasAllowedGenre;
        });
      
      console.log(`\nFinal filtered TV shows: ${filteredShows.length}`);
      filteredShows.forEach(show => console.log(`- ${show.name} (Genres: ${show.genre_ids?.join(', ')})`));
      
      media.push(...filteredShows);
    }

    return media;
  });
}; 