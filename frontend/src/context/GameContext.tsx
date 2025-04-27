import React, { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import { Actor, Movie, GameState } from '../types';

// Initial state
const initialState: GameState = {
  targetActor: null,
  currentPath: [],
  maxHops: 6,
  gameStatus: 'not_started',
};

// Action types
type Action =
  | { type: 'SET_TARGET_ACTOR'; payload: Actor }
  | { type: 'START_GAME'; payload: Actor }
  | { type: 'SELECT_MOVIE'; payload: Movie }
  | { type: 'SELECT_ACTOR'; payload: Actor }
  | { type: 'RESET_GAME' };

// Reducer function
const gameReducer = (state: GameState, action: Action): GameState => {
  const payloadLog = 'payload' in action ? action.payload : undefined;
  console.log('[GameReducer] Action:', action.type, 'Payload:', payloadLog, 'PrevState:', state);
  let result: GameState;
  switch (action.type) {
    case 'SET_TARGET_ACTOR':
      // Prevent setting the same actor again
      if (state.targetActor?.id === action.payload.id) {
        return state;
      }
      console.log('Setting target actor:', action.payload);
      result = {
        ...state,
        targetActor: action.payload,
      };
      break;
    case 'START_GAME':
      result = {
        ...state,
        currentPath: [{ actor: action.payload }],
        gameStatus: 'in_progress',
      };
      break;
    case 'SELECT_MOVIE':
      result = {
        ...state,
        currentPath: state.currentPath.map((item, index) => {
          if (index === state.currentPath.length - 1) {
            return { ...item, movie: action.payload };
          }
          return item;
        }),
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
    default:
      result = state;
  }
  console.log('[GameReducer] NewState:', result, 'currentPath:', result.currentPath, 'gameStatus:', result.gameStatus);
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
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

// Provider component
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Debug state on changes
  useEffect(() => {
    console.log('Game state updated:', state);
  }, [state]);

  useEffect(() => {
    console.log('[GameProvider] Initialized. State:', state);
  }, []);

  // Memoize action creators to prevent unnecessary rerenders
  const setTargetActor = useCallback((actor: Actor) => {
    dispatch({ type: 'SET_TARGET_ACTOR', payload: actor });
  }, []);

  const startGame = useCallback((actor: Actor) => {
    dispatch({ type: 'START_GAME', payload: actor });
  }, []);

  const selectMovie = useCallback((movie: Movie) => {
    dispatch({ type: 'SELECT_MOVIE', payload: movie });
  }, []);

  const selectActor = useCallback((actor: Actor) => {
    dispatch({ type: 'SELECT_ACTOR', payload: actor });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
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
    }),
    [state, setTargetActor, startGame, selectMovie, selectActor, resetGame]
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