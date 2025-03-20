
import { 
  EVENT_TEMPLATES, 
  ITEMS, 
  EventType, 
  CharacterAttribute, 
  Event, 
  Choice,
  VICTORY_CONDITIONS,
  DEFEAT_CONDITIONS,
  Enemy
} from '../data/gameData';
import { Character } from '../context/GameContext';

// Generate a random number between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Pick a random event of the specified type, or any type if not specified
export const generateEvent = (
  character: Character,
  eventHistory: Event[],
  eventCount: number
): Event => {
  // Get next event type based on the last choice made or pick randomly
  let nextEventType: EventType | undefined;
  
  if (eventHistory.length > 0 && eventHistory[eventHistory.length - 1].choiceMade) {
    nextEventType = eventHistory[eventHistory.length - 1].choiceMade.consequences.nextEventType;
  }
  
  // Boss events only occur after a certain number of events
  if (eventCount >= 10 && getRandomInt(1, 10) > 7) {
    nextEventType = 'boss';
  } else if (!nextEventType) {
    // If no specific type is determined, pick randomly
    const eventTypes = Object.keys(EVENT_TEMPLATES) as EventType[];
    const filteredTypes = eventTypes.filter(type => 
      type !== 'boss' || eventCount >= 10
    );
    nextEventType = filteredTypes[getRandomInt(0, filteredTypes.length - 1)];
  }
  
  // Get all events of the determined type
  const possibleEvents = EVENT_TEMPLATES[nextEventType];
  
  // Filter out events that we've already seen, unless no choices
  const unseenEvents = possibleEvents.filter(
    event => !eventHistory.some(pastEvent => pastEvent.id === event.id)
  );
  
  // If we have unseen events, pick from those; otherwise pick from all
  const eventPool = unseenEvents.length > 0 ? unseenEvents : possibleEvents;
  
  // Deep clone a random event from the pool
  const selectedEvent = JSON.parse(JSON.stringify(
    eventPool[getRandomInt(0, eventPool.length - 1)]
  )) as Event;
  
  // Apply randomness to enemy attributes if present
  if (selectedEvent.enemies) {
    selectedEvent.enemies = selectedEvent.enemies.map(enemy => ({
      ...enemy,
      attributes: Object.fromEntries(
        Object.entries(enemy.attributes).map(([attr, value]) => {
          if (typeof value === 'number') {
            return [attr, getRandomInt(Math.max(1, value - 2), value + 2)];
          }
          return [attr, value];
        })
      )
    }));
  }
  
  return selectedEvent;
};

// Calculate outcomes based on character, event, and choice
export const calculateOutcome = (
  character: Character,
  event: Event,
  choice: Choice
): {
  updatedCharacter: Character;
  outcome: string;
  gameOver: boolean;
  victory: boolean;
  message: string;
} => {
  // Deep clone character to avoid direct state mutations
  const updatedCharacter = JSON.parse(JSON.stringify(character)) as Character;
  let outcomeMessage = '';
  let gameOver = false;
  let victory = false;
  let message = '';
  
  // Apply attribute changes
  if (choice.consequences.attributeChanges) {
    Object.entries(choice.consequences.attributeChanges).forEach(([attr, change]) => {
      const attribute = attr as CharacterAttribute;
      updatedCharacter.attributes[attribute] += change;
      
      if (change > 0) {
        outcomeMessage += `Your ${attribute} increased by ${change}. `;
      } else if (change < 0) {
        outcomeMessage += `Your ${attribute} decreased by ${Math.abs(change)}. `;
      }
    });
  }
  
  // Add gained items
  if (choice.consequences.itemsGained && choice.consequences.itemsGained.length > 0) {
    choice.consequences.itemsGained.forEach(itemId => {
      const item = ITEMS[itemId];
      if (item) {
        updatedCharacter.items.push(item);
        outcomeMessage += `You acquired ${item.name}. `;
        
        // Apply item effects to attributes
        if (item.effects) {
          Object.entries(item.effects).forEach(([attr, effect]) => {
            const attribute = attr as CharacterAttribute;
            updatedCharacter.attributes[attribute] += effect;
          });
        }
      }
    });
  }
  
  // Remove lost items
  if (choice.consequences.itemsLost && choice.consequences.itemsLost.length > 0) {
    choice.consequences.itemsLost.forEach(itemId => {
      const itemIndex = updatedCharacter.items.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        const removedItem = updatedCharacter.items[itemIndex];
        updatedCharacter.items.splice(itemIndex, 1);
        outcomeMessage += `You lost ${removedItem.name}. `;
        
        // Remove item effects from attributes
        if (removedItem.effects) {
          Object.entries(removedItem.effects).forEach(([attr, effect]) => {
            const attribute = attr as CharacterAttribute;
            updatedCharacter.attributes[attribute] -= effect;
          });
        }
      }
    });
  }
  
  // Handle combat outcomes with enemies
  if (event.type === 'combat' || event.type === 'boss') {
    if (choice.id.includes('fight') || choice.id.includes('attack')) {
      // Simulate a simple combat outcome based on strength vs. enemy strength
      const totalEnemyStrength = event.enemies?.reduce(
        (sum, enemy) => sum + (enemy.attributes.strength || 0), 
        0
      ) || 0;
      
      const strengthDifference = updatedCharacter.attributes.strength - totalEnemyStrength;
      
      if (strengthDifference >= 0) {
        outcomeMessage += 'You defeated your enemies! ';
      } else {
        outcomeMessage += 'You struggled against your enemies but survived. ';
      }
    }
  }
  
  // Check victory conditions
  for (const condition of VICTORY_CONDITIONS) {
    // Check for required items
    if (condition.requiredItems && condition.requiredItems.length > 0) {
      const hasAllItems = condition.requiredItems.every(itemId => 
        updatedCharacter.items.some(item => item.id === itemId)
      );
      
      if (hasAllItems) {
        victory = true;
        gameOver = true;
        message = condition.message;
        break;
      }
    }
    
    // Check for required attributes
    if (condition.requiredAttributes) {
      const meetsAttributeRequirements = Object.entries(condition.requiredAttributes).every(
        ([attr, value]) => updatedCharacter.attributes[attr as CharacterAttribute] >= value
      );
      
      if (meetsAttributeRequirements) {
        victory = true;
        gameOver = true;
        message = condition.message;
        break;
      }
    }
  }
  
  // Check defeat conditions
  if (!gameOver) {
    for (const condition of DEFEAT_CONDITIONS) {
      // Check health threshold
      if (
        condition.healthThreshold !== undefined && 
        updatedCharacter.attributes.health <= condition.healthThreshold
      ) {
        gameOver = true;
        victory = false;
        message = condition.message;
        break;
      }
    }
  }
  
  return {
    updatedCharacter,
    outcome: outcomeMessage,
    gameOver,
    victory,
    message
  };
};

// Check if a character meets the requirements for a choice
export const meetsRequirements = (
  character: Character,
  choice: Choice
): boolean => {
  // Check attribute requirements
  if (choice.requiredAttributes) {
    for (const [attr, value] of Object.entries(choice.requiredAttributes)) {
      if (character.attributes[attr as CharacterAttribute] < value) {
        return false;
      }
    }
  }
  
  // Check item requirements
  if (choice.requiredItems && choice.requiredItems.length > 0) {
    for (const itemId of choice.requiredItems) {
      if (!character.items.some(item => item.id === itemId)) {
        return false;
      }
    }
  }
  
  return true;
};
