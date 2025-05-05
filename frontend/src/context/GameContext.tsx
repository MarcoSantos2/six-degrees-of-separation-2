import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { Actor, Media, GameState, MediaFilter } from '../types';

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
    timerDuration: 7, // in minutes
    mediaFilter: 'ALL_MEDIA' as MediaFilter
  },
  timer: {
    remainingTime: 0,
    isRunning: false,
    isPaused: false
  }
};

// Action types
type Action =
  | { type: 'SET_TARGET_ACTOR'; payload: Actor }
  | { type: 'START_GAME'; payload: { targetActor: Actor; startingActor: Actor } }
  | { type: 'SELECT_MEDIA'; payload: Media }
  | { type: 'SELECT_ACTOR'; payload: Actor }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_SETTINGS'; payload: GameState['settings'] }
  | { type: 'SET_TIMER_DURATION'; payload: number }
  | { type: 'TOGGLE_TIMER' }
  | { type: 'UPDATE_TIMER'; payload: number }
  | { type: 'STOP_TIMER' }
  | { type: 'START_TIMER' }
  | { type: 'TIME_UP' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESUME_TIMER' };

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

    case 'START_GAME': {
      const isImmediateLose =
        (state.settings.maxHops === 1) &&
        (action.payload.startingActor.id !== action.payload.targetActor.id);
      return {
        ...state,
        targetActor: action.payload.targetActor,
        currentPath: [{ actor: action.payload.startingActor }],
        gameStatus: isImmediateLose ? 'lost' : 'in_progress',
        timer: {
          remainingTime: state.settings.timerEnabled ? state.settings.timerDuration * 60 : 0,
          isRunning: state.settings.timerEnabled,
          isPaused: false
        }
      };
    }

    case 'SELECT_MEDIA':
      // Prevent selection if game is already over
      if (state.gameStatus === 'lost' || state.gameStatus === 'won') {
        return state;
      }
      return {
        ...state,
        currentPath: [
          ...state.currentPath.slice(0, -1),
          { ...state.currentPath[state.currentPath.length - 1], media: action.payload },
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

      // Check lose condition (max moves reached) - now always enforced
      if (totalActors >= state.settings.maxHops) {
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
          isRunning: false,
          isPaused: false
        }
      };

    case 'START_TIMER':
      return {
        ...state,
        timer: {
          remainingTime: state.settings.timerEnabled ? state.settings.timerDuration * 60 : 0,
          isRunning: state.settings.timerEnabled,
          isPaused: false
        }
      };

    case 'TIME_UP':
      return {
        ...state,
        gameStatus: 'lost'
      };

    case 'PAUSE_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          isPaused: true
        }
      };

    case 'RESUME_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          isPaused: false
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
  selectMedia: (media: Media) => void;
  selectActor: (actor: Actor) => void;
  resetGame: () => void;
  updateSettings: (settings: GameState['settings']) => void;
  setTimerDuration: (minutes: number) => void;
  toggleTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
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

  const selectMedia = useCallback((media: Media) => {
    dispatch({ type: 'SELECT_MEDIA', payload: media });
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
    let intervalId: NodeJS.Timeout;

    if (state.timer.isRunning && state.timer.remainingTime > 0 && state.settings.timerEnabled && !state.timer.isPaused) {
      intervalId = setInterval(() => {
        const newTime = state.timer.remainingTime - 1;
        dispatch({ type: 'UPDATE_TIMER', payload: newTime });

        if (newTime <= 0 && state.settings.timerEnabled) {
          dispatch({ type: 'STOP_TIMER' });
          dispatch({ type: 'TIME_UP' });
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [state.timer.isRunning, state.timer.remainingTime, state.settings.timerEnabled, state.timer.isPaused]);

  // Add pause/resume functions
  const pauseTimer = useCallback(() => {
    dispatch({ type: 'PAUSE_TIMER' });
  }, []);

  const resumeTimer = useCallback(() => {
    dispatch({ type: 'RESUME_TIMER' });
  }, []);

  // Memoize the context value to prevent unnecessary rerenders
  const contextValue = React.useMemo(
    () => ({
      state,
      dispatch,
      setTargetActor,
      startGame,
      selectMedia,
      selectActor,
      resetGame,
      updateSettings,
      setTimerDuration,
      toggleTimer,
      pauseTimer,
      resumeTimer
    }),
    [state, dispatch, setTargetActor, startGame, selectMedia, selectActor, resetGame, updateSettings, setTimerDuration, toggleTimer, pauseTimer, resumeTimer]
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