import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { Actor, Movie, GameState } from '../types';

// Initial state
const initialState: GameState = {
  targetActor: null,
  currentPath: [],
  maxHops: 6,
  gameStatus: 'not_started',
  settings: {
    filterByWestern: true,
    theme: 'light',
    maxHops: 6,
    maxHopsEnabled: false,
    timerEnabled: false,
    timerDuration: 7 // in minutes
  },
  timer: {
    remainingTime: 0,
    isRunning: false
  }
};

// Action types
type Action =
  | { type: 'SET_TARGET_ACTOR'; payload: Actor }
  | { type: 'START_GAME'; payload: { targetActor: Actor; startingActor: Actor } }
  | { type: 'SELECT_MOVIE'; payload: Movie }
  | { type: 'SELECT_ACTOR'; payload: Actor }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_SETTINGS'; payload: GameState['settings'] }
  | { type: 'SET_TIMER_DURATION'; payload: number }
  | { type: 'TOGGLE_TIMER' }
  | { type: 'UPDATE_TIMER'; payload: number }
  | { type: 'STOP_TIMER' }
  | { type: 'START_TIMER' };

// Reducer function
const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'SET_TARGET_ACTOR':
      // Prevent setting the same actor again
      if (state.targetActor?.id === action.payload.id) {
        return state;
      }
      return {
        ...state,
        targetActor: action.payload,
      };

    case 'START_GAME':
      return {
        ...state,
        targetActor: action.payload.targetActor,
        currentPath: [{ actor: action.payload.startingActor }],
        gameStatus: 'in_progress',
        timer: {
          remainingTime: state.settings.timerEnabled ? state.settings.timerDuration * 60 : 0,
          isRunning: state.settings.timerEnabled
        }
      };

    case 'SELECT_MOVIE':
      // Prevent selection if game is already over
      if (state.gameStatus === 'lost' || state.gameStatus === 'won') {
        return state;
      }
      return {
        ...state,
        currentPath: [
          ...state.currentPath.slice(0, -1),
          { ...state.currentPath[state.currentPath.length - 1], movie: action.payload },
        ],
      };

    case 'SELECT_ACTOR':
      // Prevent selection if game is already over
      if (state.gameStatus === 'lost' || state.gameStatus === 'won') {
        return state;
      }

      // Create updated path with the new actor
      const updatedPath = [...state.currentPath, { actor: action.payload }];
      
      // Check win condition
      if (action.payload.id === state.targetActor?.id) {
        return {
          ...state,
          currentPath: updatedPath,
          gameStatus: 'won',
        };
      }

      // Calculate moves made (each actor selection counts as a move)
      const totalActors = updatedPath.filter(item => item.actor).length;

      // Check lose condition (max moves reached)
      if (state.settings.maxHopsEnabled && totalActors >= state.settings.maxHops) {
        return {
          ...state,
          currentPath: updatedPath,
          gameStatus: 'lost',
        };
      }

      // Continue game
      return {
        ...state,
        currentPath: updatedPath,
      };

    case 'RESET_GAME':
      return {
        ...initialState,
        settings: state.settings // Preserve settings
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: action.payload
      };

    case 'SET_TIMER_DURATION':
      return {
        ...state,
        settings: {
          ...state.settings,
          timerDuration: action.payload
        }
      };

    case 'TOGGLE_TIMER':
      return {
        ...state,
        settings: {
          ...state.settings,
          timerEnabled: !state.settings.timerEnabled
        }
      };

    case 'UPDATE_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          remainingTime: action.payload,
          isRunning: action.payload > 0
        }
      };

    case 'STOP_TIMER':
      return {
        ...state,
        timer: {
          remainingTime: 0,
          isRunning: false
        }
      };

    case 'START_TIMER':
      return {
        ...state,
        timer: {
          remainingTime: state.settings.timerEnabled ? state.settings.timerDuration * 60 : 0,
          isRunning: state.settings.timerEnabled
        }
      };

    default:
      return state;
  }
};

// Create context
interface GameContextProps {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  setTargetActor: (actor: Actor) => void;
  startGame: (actor: Actor) => void;
  selectMovie: (movie: Movie) => void;
  selectActor: (actor: Actor) => void;
  resetGame: () => void;
  updateSettings: (settings: GameState['settings']) => void;
  setTimerDuration: (minutes: number) => void;
  toggleTimer: () => void;
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

  const setTimerDuration = useCallback((minutes: number) => {
    dispatch({ type: 'SET_TIMER_DURATION', payload: minutes });
  }, []);

  const toggleTimer = useCallback(() => {
    dispatch({ type: 'TOGGLE_TIMER' });
  }, []);

  // Add timer effect
  useEffect(() => {
    let intervalId: number;

    if (state.timer.isRunning && state.timer.remainingTime > 0) {
      intervalId = setInterval(() => {
        const newTime = state.timer.remainingTime - 1;
        dispatch({ type: 'UPDATE_TIMER', payload: newTime });

        if (newTime <= 0) {
          dispatch({ type: 'STOP_TIMER' });
          dispatch({ type: 'SELECT_ACTOR', payload: state.targetActor! }); // Force game over
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [state.timer.isRunning, state.timer.remainingTime, state.targetActor]);

  // Memoize the context value to prevent unnecessary rerenders
  const contextValue = React.useMemo(
    () => ({
      state,
      dispatch,
      setTargetActor,
      startGame,
      selectMovie,
      selectActor,
      resetGame,
      updateSettings,
      setTimerDuration,
      toggleTimer
    }),
    [state, dispatch, setTargetActor, startGame, selectMovie, selectActor, resetGame, updateSettings, setTimerDuration, toggleTimer]
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