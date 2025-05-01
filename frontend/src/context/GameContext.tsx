import React, { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import { Actor, Movie, GameState } from '../types';

// Initial state
const initialState: GameState = {
  targetActor: null,
  currentPath: [],
  maxHops: 6,
  gameStatus: 'not_started',
  settings: {
    filterByWestern: true,
    theme: 'light'
  }
};

// Action types
type Action =
  | { type: 'SET_TARGET_ACTOR'; payload: Actor }
  | { type: 'START_GAME'; payload: { targetActor: Actor; startingActor: Actor } }
  | { type: 'SELECT_MOVIE'; payload: Movie }
  | { type: 'SELECT_ACTOR'; payload: Actor }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_SETTINGS'; payload: GameState['settings'] };

// Reducer function
const gameReducer = (state: GameState, action: Action): GameState => {
  const payloadLog = 'payload' in action ? action.payload : undefined;
  let result: GameState;
  switch (action.type) {
    case 'SET_TARGET_ACTOR':
      // Prevent setting the same actor again
      if (state.targetActor?.id === action.payload.id) {
        return state;
      }
      result = {
        ...state,
        targetActor: action.payload,
      };
      break;
    case 'START_GAME':
      result = {
        ...state,
        targetActor: action.payload.targetActor,
        currentPath: [{ actor: action.payload.startingActor }],
        gameStatus: 'in_progress',
      };
      break;
    case 'SELECT_MOVIE':
      result = {
        ...state,
        currentPath: [
          ...state.currentPath.slice(0, -1),
          { ...state.currentPath[state.currentPath.length - 1], movie: action.payload },
        ],
      };
      break;
    case 'SELECT_ACTOR':
      // Create updated path with the new actor
      const updatedPath = [...state.currentPath, { actor: action.payload }];
      
      // Only check win condition if at least one hop has been made (path length >= 2)
      if (action.payload.id === state.targetActor?.id) {
        result = {
          ...state,
          currentPath: updatedPath,
          gameStatus: 'won',
        };
        break;
      }

      // Check lose condition (max hops reached)
      // In the game, a "hop" is a complete actor -> movie -> actor sequence
      // We need to calculate actual number of hops based on actor selections
      const totalActors = updatedPath.filter(item => item.actor).length;
      // We start with an actor and add actors, so:
      // 1 actor = 0 hops, 2 actors = 1 hop, 3 actors = 2 hops, etc.
      const hopsMade = totalActors - 1;
      if (hopsMade >= state.maxHops) {
        result = {
          ...state,
          currentPath: updatedPath,
          gameStatus: 'lost',
        };
        break;
      }

      // Continue game
      result = {
        ...state,
        currentPath: updatedPath,
      };
      break;
    case 'RESET_GAME':
      result = {
        ...initialState,
        targetActor: state.targetActor,
      };
      break;
    case 'UPDATE_SETTINGS':
      result = {
        ...state,
        settings: action.payload
      };
      break;
    default:
      result = state;
  }
  return result;
};

// Create context
interface GameContextProps {
  state: GameState;
  setTargetActor: (actor: Actor) => void;
  startGame: (actor: Actor) => void;
  selectMovie: (movie: Movie) => void;
  selectActor: (actor: Actor) => void;
  resetGame: () => void;
  updateSettings: (settings: GameState['settings']) => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

// Provider component
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Memoize action creators to prevent unnecessary rerenders
  const setTargetActor = useCallback((actor: Actor) => {
    dispatch({ type: 'SET_TARGET_ACTOR', payload: actor });
  }, []);

  const startGame = useCallback((startingActor: Actor) => {
    if (!state.targetActor) {
      console.error('No target actor set');
      return;
    }
    dispatch({ type: 'START_GAME', payload: { targetActor: state.targetActor, startingActor } });
  }, [state.targetActor]);

  const selectMovie = useCallback((movie: Movie) => {
    dispatch({ type: 'SELECT_MOVIE', payload: movie });
  }, []);

  const selectActor = useCallback((actor: Actor) => {
    dispatch({ type: 'SELECT_ACTOR', payload: actor });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const updateSettings = useCallback((settings: GameState['settings']) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  // Memoize the context value to prevent unnecessary rerenders
  const contextValue = React.useMemo(
    () => ({
      state,
      setTargetActor,
      startGame,
      selectMovie,
      selectActor,
      resetGame,
      updateSettings,
    }),
    [state, setTargetActor, startGame, selectMovie, selectActor, resetGame, updateSettings]
  );

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = (): GameContextProps => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 