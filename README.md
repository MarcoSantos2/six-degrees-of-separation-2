# Six Degrees of Movie Separation

A web game where players connect from any starting actor to a target actor in 6 or fewer hops, inspired by the "Six Degrees of Kevin Bacon" concept.

## Project Structure

This project consists of two parts:

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React.js + TypeScript

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm (v6+)
- A TMDB API key (get one at https://www.themoviedb.org/settings/api)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=5000
   TMDB_API_KEY=your_tmdb_api_key_here
   TMDB_API_BASE_URL=https://api.themoviedb.org/3
   ```

4. Build and start the backend server:
   - For development:
     ```
     npm run dev
     ```
   - For production:
     ```
     npm run build
     npm start
     ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

4. The application will be available at `http://localhost:5173`

## Running Tests

### Backend Tests

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Run tests:
   ```
   npm test
   ```

## Game Rules

1. The game starts by displaying a target actor (e.g., Jim Parsons).
2. The player selects a starting actor from a predefined list or searches for one.
3. The player then picks a movie that the current actor appeared in.
4. Next, the player picks another actor from that movie's cast.
5. This process repeats until the player either:
   - Reaches the target actor (win)
   - Uses up all six hops (lose)

## Technologies Used

- **Backend**:
  - Node.js
  - Express
  - TypeScript
  - Jest (for testing)
  - TMDB API

- **Frontend**:
  - React
  - TypeScript
  - React Router
  - Context API (for state management)
  - CSS

## API Endpoints

- `GET /api/target` - Returns the target actor
- `GET /api/movies?actorId=<id>` - Returns movies for a given actor
- `GET /api/cast?movieId=<id>` - Returns cast list for a given movie 