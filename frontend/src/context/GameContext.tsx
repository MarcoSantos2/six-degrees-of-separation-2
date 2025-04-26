import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Actor, Movie, GameState, GamePath } from '../types';

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
  switch (action.type) {
    case 'SET_TARGET_ACTOR':
      return {
        ...state,
        targetActor: action.payload,
      };
    case 'START_GAME':
      return {
        ...state,
        currentPath: [{ actor: action.payload }],
        gameStatus: 'in_progress',
      };
    case 'SELECT_MOVIE':
      return {
        ...state,
        currentPath: state.currentPath.map((item, index) => {
          if (index === state.currentPath.length - 1) {
            return { ...item, movie: action.payload };
          }
          return item;
        }),
      };
    case 'SELECT_ACTOR':
      // Check win condition
      if (action.payload.id === state.targetActor?.id) {
        return {
          ...state,
          currentPath: [...state.currentPath, { actor: action.payload }],
          gameStatus: 'won',
        };
      }

      // Check lose condition (max hops reached)
      if (state.currentPath.length >= state.maxHops) {
        return {
          ...state,
          currentPath: [...state.currentPath, { actor: action.payload }],
          gameStatus: 'lost',
        };
      }

      // Continue game
      return {
        ...state,
        currentPath: [...state.currentPath, { actor: action.payload }],
      };
    case 'RESET_GAME':
      return {
        ...initialState,
        targetActor: state.targetActor,
      };
    default:
      return state;
  }
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

  const setTargetActor = (actor: Actor) => {
    dispatch({ type: 'SET_TARGET_ACTOR', payload: actor });
  };

  const startGame = (actor: Actor) => {
    dispatch({ type: 'START_GAME', payload: actor });
  };

  const selectMovie = (movie: Movie) => {
    dispatch({ type: 'SELECT_MOVIE', payload: movie });
  };

  const selectActor = (actor: Actor) => {
    dispatch({ type: 'SELECT_ACTOR', payload: actor });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <GameContext.Provider
      value={{
        state,
        setTargetActor,
        startGame,
        selectMovie,
        selectActor,
        resetGame,
      }}
    >
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