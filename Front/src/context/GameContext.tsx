
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Event, GameStage, CharacterAttribute, Item, Choice } from '../data/gameData';
import * as apiService from '../services/apiService';

export interface Character {
  name: string;
  avatar: string;
  attributes: {
    [key in CharacterAttribute]: number;
  };
  items: Item[];
}

interface GameState {
  stage: GameStage;
  character: Character | null;
  currentEvent: Event | null;
  eventHistory: Event[];
  gameOver: boolean;
  victory: boolean;
  message: string;
}

type GameAction = 
  | { type: 'CREATE_CHARACTER'; payload: Character }
  | { type: 'START_GAME' }
  | { type: 'NEXT_EVENT' }
  | { type: 'MAKE_CHOICE'; payload: Choice }
  | { type: 'GAME_OVER'; payload: { victory: boolean; message: string } }
  | { type: 'RESET_GAME' }
  | { type: 'SET_EVENT'; payload: Event }
  | { type: 'UPDATE_CHARACTER_AND_EVENT'; payload: { character: Character; event: Event; gameOver: boolean; victory: boolean; message: string } };

const initialState: GameState = {
  stage: 'character_creation',
  character: null,
  currentEvent: null,
  eventHistory: [],
  gameOver: false,
  victory: false,
  message: '',
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'CREATE_CHARACTER':
      return {
        ...state,
        character: action.payload,
        stage: 'intro',
      };
    case 'START_GAME':
      return {
        ...state,
        stage: 'playing',
      };
    case 'SET_EVENT':
      return {
        ...state,
        currentEvent: action.payload,
      };
    case 'NEXT_EVENT':
      if (state.gameOver) return state;
      return state;
    case 'UPDATE_CHARACTER_AND_EVENT':
      const { character, event, gameOver, victory, message } = action.payload;
      return {
        ...state,
        character,
        currentEvent: event,
        eventHistory: [...state.eventHistory, event],
        gameOver,
        victory,
        message,
      };
    case 'GAME_OVER':
      return {
        ...state,
        gameOver: true,
        victory: action.payload.victory,
        message: action.payload.message,
      };
    case 'RESET_GAME':
      return initialState;
    default:
      return state;
  }
};

type GameContextType = {
  state: GameState;
  createCharacter: (character: Character) => void;
  startGame: () => void;
  nextEvent: () => void;
  makeChoice: (choice: Choice) => void;
  resetGame: () => void;
  isLoading: boolean;
  error: Error | null;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // État de chargement global
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  // Mutation pour créer un personnage
  const createCharacterMutation = useMutation({
    mutationFn: apiService.createCharacter,
    onSuccess: (character) => {
      dispatch({ type: 'CREATE_CHARACTER', payload: character });
    },
    onError: (error: Error) => {
      setError(error);
    }
  });

  // Mutation pour générer un événement
  const generateEventMutation = useMutation({
    mutationFn: ({ characterId, eventHistory, eventCount }: { characterId: string, eventHistory: string[], eventCount: number }) => 
      apiService.generateEvent(characterId, eventHistory, eventCount),
    onSuccess: (event) => {
      dispatch({ type: 'SET_EVENT', payload: event });
    },
    onError: (error: Error) => {
      setError(error);
    }
  });

  // Mutation pour calculer le résultat d'un choix
  const calculateOutcomeMutation = useMutation({
    mutationFn: ({ characterId, eventId, choiceId }: { characterId: string, eventId: string, choiceId: string }) => 
      apiService.calculateOutcome(characterId, eventId, choiceId),
    onSuccess: (data) => {
      const { updatedCharacter, outcome, gameOver, victory, message } = data;
      
      // Mettre à jour l'événement actuel avec le résultat
      const updatedEvent = {
        ...state.currentEvent!,
        outcome,
        choiceMade: state.currentEvent?.choices.find(c => c.id === calculateOutcomeMutation.variables?.choiceId)
      };
      
      dispatch({ 
        type: 'UPDATE_CHARACTER_AND_EVENT', 
        payload: { 
          character: updatedCharacter, 
          event: updatedEvent as Event, 
          gameOver, 
          victory, 
          message 
        } 
      });
    },
    onError: (error: Error) => {
      setError(error);
    }
  });

  const createCharacter = (character: Character) => {
    setIsLoading(true);
    createCharacterMutation.mutate(character);
    setIsLoading(false);
  };

  const startGame = async () => {
    if (!state.character) return;
    
    setIsLoading(true);
    dispatch({ type: 'START_GAME' });
    
    try {
      // Génère le premier événement
      generateEventMutation.mutate({ 
        characterId: state.character.name, 
        eventHistory: [], 
        eventCount: 0 
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextEvent = async () => {
    if (!state.character || state.gameOver) return;
    
    setIsLoading(true);
    
    try {
      // Génère le prochain événement
      generateEventMutation.mutate({ 
        characterId: state.character.name, 
        eventHistory: state.eventHistory.map(e => e.id), 
        eventCount: state.eventHistory.length 
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const makeChoice = (choice: Choice) => {
    if (!state.character || !state.currentEvent) return;
    
    setIsLoading(true);
    
    try {
      // Calcule le résultat du choix
      calculateOutcomeMutation.mutate({ 
        characterId: state.character.name, 
        eventId: state.currentEvent.id, 
        choiceId: choice.id 
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <GameContext.Provider
      value={{
        state,
        createCharacter,
        startGame,
        nextEvent,
        makeChoice,
        resetGame,
        isLoading,
        error
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
