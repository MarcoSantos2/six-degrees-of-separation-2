import axios from 'axios';
import dotenv from 'dotenv';
import { ALLOWED_TV_GENRES } from '../types';
import { getMediaByActor } from '../services/tmdbService';

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

async function checkTVShowGenres(showName: string) {
  try {
    // Search for the show
    console.log(`\nSearching for TV show: ${showName}`);
    const searchResponse = await tmdbApi.get('/search/tv', {
      params: {
        query: showName,
        include_adult: false,
      },
    });

    if (searchResponse.data.results.length === 0) {
      console.log('No results found');
      return;
    }

    // Get the first result
    const show = searchResponse.data.results[0];
    console.log(`\nFound show: ${show.name} (ID: ${show.id})`);

    // Get detailed information
    const detailsResponse = await tmdbApi.get(`/tv/${show.id}`);
    const genres = detailsResponse.data.genres;
    
    console.log('\nShow details:');
    console.log('Name:', detailsResponse.data.name);
    console.log('Type:', detailsResponse.data.type);
    console.log('Genres:', genres.map((g: any) => `${g.name} (${g.id})`).join(', '));
    
    // Check if any of the genres are in our allowed list
    const hasAllowedGenre = genres.some((g: any) => ALLOWED_TV_GENRES.includes(g.id));
    console.log('\nHas allowed genre:', hasAllowedGenre);
    
    if (!hasAllowedGenre) {
      console.log('\nThis show should be filtered out!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Test with Jimmy Kimmel Live!
// checkTVShowGenres('Honest Trailers'); 

// --- Custom test for Yoon Yool's movies ---
async function testYoonYoolMovies() {
  const actorId = 1398022; // Yoon Yool
  const movies = await getMediaByActor(actorId, 'MOVIES_ONLY');
  console.log('\nMovies for Yoon Yool:');
  movies.forEach(m => {
    const title = m.media_type === 'movie' ? m.title : m.name;
    const releaseDate = m.media_type === 'movie' ? m.release_date : m.first_air_date;
    // Only print 'adult' if it exists
    const result: any = {
      title,
      releaseDate,
      media_type: m.media_type
    };
    if ('adult' in m) result.adult = (m as any).adult;
    console.log(result);
  });
}

testYoonYoolMovies(); 