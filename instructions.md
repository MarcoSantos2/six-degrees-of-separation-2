Project: “6 Degrees of Movie Separation”  
Tech stack:  
• Backend: Node.js + Express + TypeScript  
• Frontend: React.js + TypeScript

Goal  
Build a web game where the player must connect from any movie to a “target actor” (e.g. Jim Parsons) in as few hops as possible. On each turn the player picks a movie, then an actor from that movie, then a next movie that actor appears in, etc., until they land on the target actor or run out of tries/time.

Requirements  

1. Data source  
   - Integrate with The Movie Database (TMDB) API (or similar) to fetch:  
     • Popular movies / search by actor  
     • Movie → cast list  
     • Actor → filmography  

2. Backend (Node.js + Express + TypeScript)  
   - Scaffold an Express app in TS with linting (ESLint) and formatting (Prettier).  
   - Expose these REST endpoints:  
     • `GET  /api/target` → returns the target actor (name, TMDB ID).  
     • `GET  /api/movies?actorId=<id>` → returns movies for a given actor.  
     • `GET  /api/cast?movieId=<id>` → returns cast list for a given movie.  
   - Include error handling, rate-limit TMDB calls, and dotenv for API keys.  
   - Write unit tests for each endpoint (Jest + Supertest).

3. Frontend (React.js + TypeScript)  
   - Use Create React App (or Vite) with TS template.  
   - Pages & components:  
     1. **Home**: show target actor, “Start Game” button.  
     2. **Movie Selection**: list of movies (from `/api/movies?actorId=`) as selectable tiles.  
     3. **Actor Selection**: list of actors (from `/api/cast?movieId=`) as selectable tiles.  
     4. **Game Status**: track and display the path taken and remaining tries/time.  
     5. **End Screen**: show success or failure, number of hops, and option to restart.  
   - Use React Router for navigation between screens.  
   - Manage state (current actor, path, tries left) with React Context or Redux Toolkit.  
   - Add basic styling (CSS modules or styled-components).

4. Game logic  
   - Initialize with a default starting actor (e.g. “Kevin Bacon”) or let user pick.  
   - Fetch movies for current actor; user selects one → fetch its cast; user selects next actor → repeat.  
   - Win condition: selected actor’s ID equals target actor’s ID.  
   - Lose condition: tries (e.g. 6 hops) or timer (e.g. 2 minutes) runs out.  

5. Deliverables  
   - A Git repo with `backend/` and `frontend/` folders.  
   - Clear README.md explaining setup:  
     • How to install dependencies, set TMDB_API_KEY in `.env`, run backend & frontend.  
     • How to run tests.  
   - Well-commented code and meaningful commit messages.

Please scaffold the project and implement all of the above in TypeScript, producing runnable code for both backend and frontend. Let me know if you need clarifications or API key setup details.
