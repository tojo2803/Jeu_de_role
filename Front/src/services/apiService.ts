import { Character } from '../context/GameContext';
import { 
  CharacterClass, 
  AvatarOption,
  ItemType,
  EventType,
  Item,
  Event,
  Choice,
  Enemy,
  CHARACTER_CLASSES,
  AVATAR_OPTIONS,
  ITEMS,
  EVENT_TEMPLATES
} from '../data/gameData';

const API_BASE_URL = 'http://localhost:3000/api'; // Change this to your backend URL when you have one

// Mock data for development
const USE_MOCK_DATA = true; // Set to false when your backend is ready

// Utility function for HTTP requests
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  if (USE_MOCK_DATA) {
    console.log(`Using mock data for ${endpoint}`);
    return getMockData(endpoint, options);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${await response.text()}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

// Mock data provider
const getMockData = (endpoint: string, options: RequestInit = {}) => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const method = options.method || 'GET';
      
      // Handle different endpoints with appropriate mock data
      if (endpoint === '/character-classes') {
        resolve(CHARACTER_CLASSES);
      } 
      else if (endpoint === '/avatars') {
        resolve(AVATAR_OPTIONS);
      }
      else if (endpoint === '/items') {
        resolve(ITEMS);
      }
      else if (endpoint === '/events') {
        // Transform EVENT_TEMPLATES to match the expected format
        const eventsByType: Record<EventType, Event[]> = {
          combat: EVENT_TEMPLATES.combat || [],
          discovery: EVENT_TEMPLATES.discovery || [],
          dialogue: EVENT_TEMPLATES.dialogue || [],
          merchant: EVENT_TEMPLATES.merchant || [],
          boss: EVENT_TEMPLATES.boss || []
        };
        resolve(eventsByType);
      }
      else if (endpoint === '/characters' && method === 'POST') {
        // For character creation, just return the provided character
        const character = JSON.parse(options.body as string);
        resolve(character);
      }
      else if (endpoint === '/generate-event' && method === 'POST') {
        // Generate a random event based on the event type
        const { eventCount } = JSON.parse(options.body as string);
        const eventTypes: EventType[] = ['combat', 'discovery', 'dialogue', 'merchant'];
        const selectedType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        // For the last event, always return a boss
        const eventType = eventCount >= 10 ? 'boss' : selectedType;
        const eventsOfType = EVENT_TEMPLATES[eventType];
        const randomEvent = eventsOfType[Math.floor(Math.random() * eventsOfType.length)];
        
        resolve(randomEvent);
      }
      else if (endpoint === '/calculate-outcome' && method === 'POST') {
        // Calculate outcome based on the choice
        const { characterId, eventId, choiceId } = JSON.parse(options.body as string);
        
        // Find the event and choice
        let foundEvent: Event | undefined;
        let foundChoice: Choice | undefined;
        
        for (const eventType in EVENT_TEMPLATES) {
          const events = EVENT_TEMPLATES[eventType as EventType];
          const event = events.find(e => e.id === eventId);
          if (event) {
            foundEvent = event;
            foundChoice = event.choices.find(c => c.id === choiceId);
            break;
          }
        }
        
        // Default outcome
        const outcome = {
          updatedCharacter: null,
          outcome: "Vous avez fait un choix",
          gameOver: false,
          victory: false,
          message: "L'aventure continue..."
        };
        
        if (foundChoice && foundChoice.consequences) {
          const { attributeChanges, itemsGained, itemsLost } = foundChoice.consequences;
          outcome.outcome = `Vous avez ${foundChoice.text.toLowerCase()} et ${
            attributeChanges?.health && attributeChanges.health < 0 
              ? `perdu ${Math.abs(attributeChanges.health)} points de santé` 
              : 'continué votre aventure'
          }`;
          
          // 5% chance of game over for demonstration
          outcome.gameOver = Math.random() < 0.05;
          
          // 5% chance of victory for demonstration
          outcome.victory = !outcome.gameOver && Math.random() < 0.05;
          
          if (outcome.gameOver) {
            outcome.message = "Votre aventure se termine ici. Vous avez succombé à vos blessures.";
          } else if (outcome.victory) {
            outcome.message = "Félicitations! Vous avez triomphé dans votre quête!";
          }
        }
        
        resolve(outcome);
      }
      else {
        // Default empty response
        resolve({});
      }
    }, 500); // 500ms delay to simulate network
  });
};

// API functions remain unchanged
export const getCharacterClasses = async (): Promise<Record<CharacterClass, {
  baseAttributes: Record<string, number>;
  startingItems: string[];
  description: string;
}>> => {
  return fetchApi('/character-classes');
};

export const getAvatars = async (): Promise<Record<AvatarOption, string>> => {
  return fetchApi('/avatars');
};

export const getItems = async (): Promise<Record<string, Item>> => {
  return fetchApi('/items');
};

export const getEventsByType = async (): Promise<Record<EventType, Event[]>> => {
  return fetchApi('/events');
};

export const getVictoryConditions = async () => {
  return fetchApi('/victory-conditions');
};

export const getDefeatConditions = async () => {
  return fetchApi('/defeat-conditions');
};

export const createCharacter = async (character: Character): Promise<Character> => {
  return fetchApi('/characters', {
    method: 'POST',
    body: JSON.stringify(character),
  });
};

export const getCharacter = async (id: string): Promise<Character> => {
  return fetchApi(`/characters/${id}`);
};

export const updateCharacter = async (character: Character): Promise<Character> => {
  return fetchApi(`/characters/${character.name}`, {
    method: 'PUT',
    body: JSON.stringify(character),
  });
};

export const generateEvent = async (
  characterId: string, 
  eventHistory: string[], 
  eventCount: number
): Promise<Event> => {
  return fetchApi('/generate-event', {
    method: 'POST',
    body: JSON.stringify({ characterId, eventHistory, eventCount }),
  });
};

export const calculateOutcome = async (
  characterId: string,
  eventId: string,
  choiceId: string
): Promise<{
  updatedCharacter: Character;
  outcome: string;
  gameOver: boolean;
  victory: boolean;
  message: string;
}> => {
  return fetchApi('/calculate-outcome', {
    method: 'POST',
    body: JSON.stringify({ characterId, eventId, choiceId }),
  });
};
