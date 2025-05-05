import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY; 
const url = `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`;

async function getTVGenres() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json() as { genres: { id: number; name: string }[] };
    console.log('Available TV Genres:');
    data.genres.forEach((genre) => {
      console.log(`${genre.id}: ${genre.name}`);
    });
  } catch (error) {
    console.error('Error fetching genres:', error);
  }
}

getTVGenres();