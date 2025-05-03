import { getPopularActors } from '../services/tmdbService';
import { getMediaByActor } from '../services/tmdbService';

async function testMediaFiltering() {
  console.log('Testing media filtering functionality...\n');

  // Test 1: TV Shows Only
  console.log('Test 1: TV Shows Only');
  const tvOnlyActors = await getPopularActors(false, 'TV_ONLY');
  console.log(`Found ${tvOnlyActors.length} actors with TV show credits`);
  
  // Verify each actor has TV show credits
  for (const actor of tvOnlyActors) {
    const media = await getMediaByActor(actor.id, 'TV_ONLY');
    if (media.length === 0) {
      console.error(`❌ Actor ${actor.name} has no TV show credits but was included in TV_ONLY filter`);
    } else {
      console.log(`✓ Actor ${actor.name} has ${media.length} TV show credits`);
    }
  }

  // Test 2: Movies Only
  console.log('\nTest 2: Movies Only');
  const moviesOnlyActors = await getPopularActors(false, 'MOVIES_ONLY');
  console.log(`Found ${moviesOnlyActors.length} actors with movie credits`);
  
  // Verify each actor has movie credits
  for (const actor of moviesOnlyActors) {
    const media = await getMediaByActor(actor.id, 'MOVIES_ONLY');
    if (media.length === 0) {
      console.error(`❌ Actor ${actor.name} has no movie credits but was included in MOVIES_ONLY filter`);
    } else {
      console.log(`✓ Actor ${actor.name} has ${media.length} movie credits`);
    }
  }

  // Test 3: All Media
  console.log('\nTest 3: All Media');
  const allMediaActors = await getPopularActors(false, 'ALL_MEDIA');
  console.log(`Found ${allMediaActors.length} actors with any media credits`);
  
  // Verify each actor has at least one credit
  for (const actor of allMediaActors) {
    const media = await getMediaByActor(actor.id, 'ALL_MEDIA');
    if (media.length === 0) {
      console.error(`❌ Actor ${actor.name} has no credits but was included in ALL_MEDIA filter`);
    } else {
      const movieCount = media.filter(m => m.media_type === 'movie').length;
      const tvCount = media.filter(m => m.media_type === 'tv').length;
      console.log(`✓ Actor ${actor.name} has ${movieCount} movies and ${tvCount} TV shows`);
    }
  }

  // Test 4: Compare counts
  console.log('\nTest 4: Comparing filter counts');
  console.log(`TV_ONLY actors: ${tvOnlyActors.length}`);
  console.log(`MOVIES_ONLY actors: ${moviesOnlyActors.length}`);
  console.log(`ALL_MEDIA actors: ${allMediaActors.length}`);
  
  // Verify that ALL_MEDIA count is not less than either individual filter
  if (allMediaActors.length < tvOnlyActors.length || allMediaActors.length < moviesOnlyActors.length) {
    console.error('❌ ALL_MEDIA count should not be less than individual filter counts');
  } else {
    console.log('✓ ALL_MEDIA count is valid');
  }
}

// Run the tests
testMediaFiltering().catch(console.error); 