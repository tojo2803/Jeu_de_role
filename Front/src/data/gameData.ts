// Types for game data
export type CharacterAttribute = 'strength' | 'intelligence' | 'charisma' | 'agility' | 'health';
export type CharacterClass = 'warrior' | 'mage' | 'rogue';
export type AvatarOption = 'warrior' | 'mage' | 'rogue' | 'female-warrior' | 'female-mage' | 'female-rogue';
export type ItemType = 'weapon' | 'armor' | 'consumable' | 'key' | 'treasure';
export type EventType = 'combat' | 'discovery' | 'dialogue' | 'merchant' | 'boss';
export type GameStage = 'character_creation' | 'intro' | 'playing' | 'game_over';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  effects?: Partial<Record<CharacterAttribute, number>>;
}

export interface Enemy {
  id: string;
  name: string;
  attributes: Partial<Record<CharacterAttribute, number>>;
}

export interface Choice {
  id: string;
  text: string;
  requiredAttributes?: Partial<Record<CharacterAttribute, number>>;
  requiredItems?: string[];
  consequences: {
    attributeChanges?: Partial<Record<CharacterAttribute, number>>;
    itemsGained?: string[];
    itemsLost?: string[];
    nextEventType?: EventType;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  image?: string;
  choices: Choice[];
  choiceMade?: Choice;
  outcome?: string;
  enemies?: Enemy[];
}

// Character class templates
export const CHARACTER_CLASSES: Record<CharacterClass, {
  baseAttributes: Record<CharacterAttribute, number>;
  startingItems: string[];
  description: string;
}> = {
  warrior: {
    baseAttributes: {
      strength: 8,
      intelligence: 3,
      charisma: 5,
      agility: 4,
      health: 10
    },
    startingItems: ['iron_sword', 'leather_armor'],
    description: 'Brave fighters with exceptional strength and durability.'
  },
  mage: {
    baseAttributes: {
      strength: 3,
      intelligence: 8,
      charisma: 6,
      agility: 3,
      health: 7
    },
    startingItems: ['apprentice_staff', 'spellbook'],
    description: 'Masters of arcane arts with superior intelligence.'
  },
  rogue: {
    baseAttributes: {
      strength: 5,
      intelligence: 5,
      charisma: 6,
      agility: 8,
      health: 6
    },
    startingItems: ['dagger', 'lockpick_set'],
    description: 'Nimble adventurers specializing in stealth and agility.'
  }
};

// Avatar options
export const AVATAR_OPTIONS: Record<AvatarOption, string> = {
  'warrior': 'https://images.unsplash.com/photo-1593207671748-ef7173b1ffe5?q=80&w=240&h=240&auto=format&fit=crop',
  'mage': 'https://images.unsplash.com/photo-1566410824233-a8015940a182?q=80&w=240&h=240&auto=format&fit=crop',
  'rogue': 'https://images.unsplash.com/photo-1535931584656-9d3380d62c7c?q=80&w=240&h=240&auto=format&fit=crop',
  'female-warrior': 'https://images.unsplash.com/photo-1535468850893-d6e543fbd7f5?q=80&w=240&h=240&auto=format&fit=crop',
  'female-mage': 'https://images.unsplash.com/photo-1556742048-ede6c971a8fe?q=80&w=240&h=240&auto=format&fit=crop',
  'female-rogue': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=240&h=240&auto=format&fit=crop'
};

// Game items - simplified to only essential items
export const ITEMS: Record<string, Item> = {
  'iron_sword': {
    id: 'iron_sword',
    name: 'Épée en Fer',
    type: 'weapon',
    description: 'Une épée simple mais efficace.',
    effects: { strength: 2 }
  },
  'leather_armor': {
    id: 'leather_armor',
    name: 'Armure en Cuir',
    type: 'armor',
    description: 'Offre une protection basique.',
    effects: { health: 1 }
  },
  'apprentice_staff': {
    id: 'apprentice_staff',
    name: 'Bâton d\'Apprenti',
    type: 'weapon',
    description: 'Un bâton simple pour lancer des sorts.',
    effects: { intelligence: 2 }
  },
  'spellbook': {
    id: 'spellbook',
    name: 'Livre de Sorts',
    type: 'key',
    description: 'Contient des incantations basiques.',
    effects: { intelligence: 1 }
  },
  'dagger': {
    id: 'dagger',
    name: 'Dague',
    type: 'weapon',
    description: 'Petite lame pour des attaques rapides.',
    effects: { agility: 1, strength: 1 }
  },
  'lockpick_set': {
    id: 'lockpick_set',
    name: 'Crochets',
    type: 'key',
    description: 'Outils pour ouvrir des serrures.',
  },
  'health_potion': {
    id: 'health_potion',
    name: 'Potion de Soin',
    type: 'consumable',
    description: 'Restaure la santé quand consommée.',
    effects: { health: 3 }
  }
};

// Event templates - simplified
export const EVENT_TEMPLATES: Record<EventType, Event[]> = {
  combat: [
    {
      id: 'bandit_ambush',
      title: 'Embuscade de Bandits',
      description: 'Vous êtes attaqué par des bandits sur le chemin de la forêt!',
      type: 'combat',
      image: 'https://images.unsplash.com/photo-1570303345338-e1f0eddf4946?q=80&w=800&auto=format&fit=crop',
      choices: [
        {
          id: 'fight',
          text: 'Combattre les bandits',
          consequences: {
            attributeChanges: { health: -2 },
            itemsGained: ['health_potion'],
          }
        },
        {
          id: 'flee',
          text: 'Tenter de fuir',
          requiredAttributes: { agility: 5 },
          consequences: {
            attributeChanges: { health: -1 },
          }
        },
        {
          id: 'negotiate',
          text: 'Essayer de négocier',
          requiredAttributes: { charisma: 6 },
          consequences: {
            itemsLost: ['iron_sword'],
          }
        }
      ]
    },
    {
      id: 'wolf_pack',
      title: 'Meute de Loups',
      description: 'Une meute de loups vous encercle, grognant de faim.',
      type: 'combat',
      image: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?q=80&w=800&auto=format&fit=crop',
      choices: [
        {
          id: 'fight_wolves',
          text: 'Tenir bon et combattre',
          consequences: {
            attributeChanges: { health: -3, strength: 1 },
          }
        },
        {
          id: 'climb_tree',
          text: 'Grimper à un arbre proche',
          requiredAttributes: { agility: 4 },
          consequences: {
            nextEventType: 'discovery'
          }
        },
        {
          id: 'use_meat',
          text: 'Jeter de la viande comme distraction',
          requiredItems: ['health_potion'],
          consequences: {
            itemsLost: ['health_potion'],
            nextEventType: 'discovery'
          }
        }
      ]
    }
  ],
  discovery: [
    {
      id: 'ancient_ruins',
      title: 'Ruines Anciennes',
      description: 'Vous tombez sur des ruines anciennes cachées dans la nature.',
      type: 'discovery',
      image: 'https://images.unsplash.com/photo-1564982752979-3f7c7f2f7063?q=80&w=800&auto=format&fit=crop',
      choices: [
        {
          id: 'explore_ruins',
          text: 'Explorer les ruines',
          consequences: {
            attributeChanges: { intelligence: 1 },
            nextEventType: 'merchant'
          }
        },
        {
          id: 'study_inscriptions',
          text: 'Étudier les inscriptions mystérieuses',
          requiredAttributes: { intelligence: 6 },
          consequences: {
            attributeChanges: { intelligence: 2 },
            nextEventType: 'discovery'
          }
        },
        {
          id: 'bypass_ruins',
          text: 'Continuer votre voyage',
          consequences: {
            nextEventType: 'dialogue'
          }
        }
      ]
    },
    {
      id: 'magical_spring',
      title: 'Source Magique',
      description: 'Vous découvrez une source brillant d\'énergie mystique.',
      type: 'discovery',
      image: 'https://images.unsplash.com/photo-1568179494549-a1abff3fe266?q=80&w=800&auto=format&fit=crop',
      choices: [
        {
          id: 'drink_water',
          text: 'Boire à la source',
          consequences: {
            attributeChanges: { health: 3, intelligence: 1 },
          }
        },
        {
          id: 'fill_vial',
          text: 'Remplir une fiole d\'eau magique',
          consequences: {
            itemsGained: ['health_potion'],
          }
        },
        {
          id: 'analyze_water',
          text: 'Analyser les propriétés de l\'eau',
          requiredAttributes: { intelligence: 7 },
          consequences: {
            attributeChanges: { intelligence: 2 },
            itemsGained: ['health_potion'],
          }
        }
      ]
    }
  ],
  dialogue: [
    {
      id: 'village_elder',
      title: 'Ancien du Village',
      description: 'Un villageois âgé s\'approche, cherchant de l\'aide pour des problèmes locaux.',
      type: 'dialogue',
      image: 'https://images.unsplash.com/photo-1578307365821-e4ec081ca57a?q=80&w=800&auto=format&fit=crop',
      choices: [
        {
          id: 'help_elder',
          text: 'Offrir votre assistance',
          consequences: {
            attributeChanges: { charisma: 1 },
            nextEventType: 'combat'
          }
        },
        {
          id: 'decline_politely',
          text: 'Décliner poliment',
          consequences: {
            nextEventType: 'merchant'
          }
        },
        {
          id: 'extract_reward',
          text: 'Demander ce que vous y gagnez',
          requiredAttributes: { charisma: 5 },
          consequences: {
            itemsGained: ['health_potion'],
            nextEventType: 'combat'
          }
        }
      ]
    },
    {
      id: 'mysterious_stranger',
      title: 'Étranger Mystérieux',
      description: 'Une silhouette encapuchonnée vous approche à la taverne avec une proposition.',
      type: 'dialogue',
      image: 'https://images.unsplash.com/photo-1584292168783-05e7a0362192?q=80&w=800&auto=format&fit=crop',
      choices: [
        {
          id: 'accept_mission',
          text: 'Accepter leur mission secrète',
          consequences: {
            nextEventType: 'discovery'
          }
        },
        {
          id: 'interrogate',
          text: 'Les interroger sur leurs motifs',
          requiredAttributes: { intelligence: 5 },
          consequences: {
            attributeChanges: { intelligence: 1 },
            nextEventType: 'dialogue'
          }
        },
        {
          id: 'walk_away',
          text: 'S\'éloigner de l\'étranger',
          consequences: {
            nextEventType: 'merchant'
          }
        }
      ]
    }
  ],
  merchant: [
    {
      id: 'traveling_trader',
      title: 'Marchand Ambulant',
      description: 'Un marchand aux marchandises exotiques vous propose de commercer.',
      type: 'merchant',
      image: 'https://images.unsplash.com/photo-1528385676307-0a7831e34cfc?q=80&w=800&auto=format&fit=crop',
      choices: [
        {
          id: 'buy_potion',
          text: 'Acheter une potion de santé',
          consequences: {
            itemsGained: ['health_potion'],
            itemsLost: ['dagger']
          }
        },
        {
          id: 'sell_items',
          text: 'Vendre certains de vos objets',
          requiredItems: ['iron_sword'],
          consequences: {
            itemsLost: ['iron_sword'],
            itemsGained: ['health_potion']
          }
        },
        {
          id: 'haggle',
          text: 'Marchander pour un meilleur prix',
          requiredAttributes: { charisma: 7 },
          consequences: {
            itemsGained: ['health_potion'],
            itemsLost: ['lockpick_set']
          }
        }
      ]
    },
    {
      id: 'blacksmith',
      title: 'Forgeron du Village',
      description: 'Un forgeron qualifié propose d\'améliorer votre équipement.',
      type: 'merchant',
      image: 'https://images.unsplash.com/photo-1545089176-1a94c3df92ab?q=80&w=800&auto=format&fit=crop',
      choices: [
        {
          id: 'upgrade_weapon',
          text: 'Améliorer votre arme',
          requiredItems: ['iron_sword'],
          consequences: {
            attributeChanges: { strength: 2 }
          }
        },
        {
          id: 'repair_armor',
          text: 'Réparer votre armure',
          requiredItems: ['leather_armor'],
          consequences: {
            attributeChanges: { health: 2 }
          }
        },
        {
          id: 'learn_smithing',
          text: 'Apprendre les bases de la forge',
          consequences: {
            attributeChanges: { intelligence: 1, strength: 1 }
          }
        }
      ]
    }
  ],
  boss: [
    {
      id: 'dragon',
      title: 'Dragon Ancien',
      description: 'Un dragon imposant bloque votre chemin, gardant un trésor précieux.',
      type: 'boss',
      image: 'https://images.unsplash.com/photo-1577493340887-b7bfff550145?q=80&w=800&auto=format&fit=crop',
      enemies: [
        {
          id: 'ancient_dragon',
          name: 'Dragon Ancien',
          attributes: {
            strength: 10,
            health: 10
          }
        }
      ],
      choices: [
        {
          id: 'fight_dragon',
          text: 'Affronter le dragon',
          requiredAttributes: { strength: 8 },
          consequences: {
            attributeChanges: { health: -5, strength: 2 },
            itemsGained: ['health_potion']
          }
        },
        {
          id: 'sneak_past',
          text: 'Essayer de se faufiler',
          requiredAttributes: { agility: 7 },
          consequences: {
            attributeChanges: { agility: 1 }
          }
        },
        {
          id: 'negotiate',
          text: 'Tenter de communiquer avec le dragon',
          requiredAttributes: { intelligence: 8, charisma: 7 },
          consequences: {
            attributeChanges: { intelligence: 2, charisma: 2 }
          }
        }
      ]
    }
  ]
};

// Game-ending conditions - simplified
export const VICTORY_CONDITIONS = [
  {
    requiredAttributes: { strength: 10, intelligence: 10, charisma: 10 },
    requiredItems: [],
    message: "Vos capacités extraordinaires vous ont permis de devenir une légende. Le royaume est à vous!"
  }
];

export const DEFEAT_CONDITIONS = [
  {
    healthThreshold: 0,
    message: "Vos blessures étaient trop graves. Votre aventure se termine ici."
  }
];
