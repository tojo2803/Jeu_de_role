
-- Schema for RPG Adventure Game

-- Character Attributes
CREATE TYPE character_attribute AS ENUM ('strength', 'intelligence', 'charisma', 'agility', 'health');

-- Character Classes
CREATE TYPE character_class AS ENUM ('warrior', 'mage', 'rogue');

-- Avatar Options
CREATE TYPE avatar_option AS ENUM ('warrior', 'mage', 'rogue', 'female-warrior', 'female-mage', 'female-rogue');

-- Item Types
CREATE TYPE item_type AS ENUM ('weapon', 'armor', 'consumable', 'key', 'treasure');

-- Event Types
CREATE TYPE event_type AS ENUM ('combat', 'discovery', 'dialogue', 'merchant', 'boss');

-- Game Stages
CREATE TYPE game_stage AS ENUM ('character_creation', 'intro', 'playing', 'game_over');

-- Table for character classes and their base stats
CREATE TABLE character_classes (
  class_id character_class PRIMARY KEY,
  base_attributes JSONB NOT NULL,
  starting_items JSONB NOT NULL,
  description TEXT NOT NULL
);

-- Table for avatar options
CREATE TABLE avatars (
  avatar_id avatar_option PRIMARY KEY,
  image_url TEXT NOT NULL
);

-- Table for game items
CREATE TABLE items (
  item_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type item_type NOT NULL,
  description TEXT NOT NULL,
  effects JSONB
);

-- Table for enemies
CREATE TABLE enemies (
  enemy_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  attributes JSONB NOT NULL
);

-- Table for events
CREATE TABLE events (
  event_id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  type event_type NOT NULL,
  image_url TEXT,
  enemies JSONB
);

-- Table for choices
CREATE TABLE choices (
  choice_id VARCHAR(50) PRIMARY KEY,
  event_id VARCHAR(50) REFERENCES events(event_id),
  text TEXT NOT NULL,
  required_attributes JSONB,
  required_items JSONB,
  attribute_changes JSONB,
  items_gained JSONB,
  items_lost JSONB,
  next_event_type event_type
);

-- Table for victory conditions
CREATE TABLE victory_conditions (
  condition_id SERIAL PRIMARY KEY,
  required_attributes JSONB,
  required_items JSONB,
  message TEXT NOT NULL
);

-- Table for defeat conditions
CREATE TABLE defeat_conditions (
  condition_id SERIAL PRIMARY KEY,
  health_threshold INTEGER,
  message TEXT NOT NULL
);

-- INSERT DATA

-- Insert character classes
INSERT INTO character_classes (class_id, base_attributes, description, starting_items) VALUES
('warrior', 
  '{"strength": 8, "intelligence": 3, "charisma": 5, "agility": 4, "health": 10}',
  'Brave fighters with exceptional strength and durability.',
  '["iron_sword", "leather_armor"]'
),
('mage', 
  '{"strength": 3, "intelligence": 8, "charisma": 6, "agility": 3, "health": 7}',
  'Masters of arcane arts with superior intelligence.',
  '["apprentice_staff", "spellbook"]'  
),
('rogue', 
  '{"strength": 5, "intelligence": 5, "charisma": 6, "agility": 8, "health": 6}',
  'Nimble adventurers specializing in stealth and agility.',
  '["dagger", "lockpick_set"]'
);

-- Insert avatars
INSERT INTO avatars (avatar_id, image_url) VALUES
('warrior', 'https://images.unsplash.com/photo-1593207671748-ef7173b1ffe5?q=80&w=240&h=240&auto=format&fit=crop'),
('mage', 'https://images.unsplash.com/photo-1566410824233-a8015940a182?q=80&w=240&h=240&auto=format&fit=crop'),
('rogue', 'https://images.unsplash.com/photo-1535931584656-9d3380d62c7c?q=80&w=240&h=240&auto=format&fit=crop'),
('female-warrior', 'https://images.unsplash.com/photo-1535468850893-d6e543fbd7f5?q=80&w=240&h=240&auto=format&fit=crop'),
('female-mage', 'https://images.unsplash.com/photo-1556742048-ede6c971a8fe?q=80&w=240&h=240&auto=format&fit=crop'),
('female-rogue', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=240&h=240&auto=format&fit=crop');

-- Insert items
INSERT INTO items (item_id, name, type, description, effects) VALUES
('iron_sword', 'Épée en Fer', 'weapon', 'Une épée simple mais efficace.', '{"strength": 2}'),
('leather_armor', 'Armure en Cuir', 'armor', 'Offre une protection basique.', '{"health": 1}'),
('apprentice_staff', 'Bâton d''Apprenti', 'weapon', 'Un bâton simple pour lancer des sorts.', '{"intelligence": 2}'),
('spellbook', 'Livre de Sorts', 'key', 'Contient des incantations basiques.', '{"intelligence": 1}'),
('dagger', 'Dague', 'weapon', 'Petite lame pour des attaques rapides.', '{"agility": 1, "strength": 1}'),
('lockpick_set', 'Crochets', 'key', 'Outils pour ouvrir des serrures.', null),
('health_potion', 'Potion de Soin', 'consumable', 'Restaure la santé quand consommée.', '{"health": 3}');

-- Insert enemies
INSERT INTO enemies (enemy_id, name, attributes) VALUES
('bandit', 'Bandit', '{"strength": 4, "health": 5}'),
('wolf', 'Loup', '{"strength": 3, "agility": 6, "health": 4}'),
('ancient_dragon', 'Dragon Ancien', '{"strength": 10, "health": 10}');

-- Insert events (a few examples)
INSERT INTO events (event_id, title, description, type, image_url, enemies) VALUES
('bandit_ambush', 'Embuscade de Bandits', 'Vous êtes attaqué par des bandits sur le chemin de la forêt!', 'combat', 
 'https://images.unsplash.com/photo-1570303345338-e1f0eddf4946?q=80&w=800&auto=format&fit=crop',
 '[{"enemy_id": "bandit"}]'),
 
('ancient_ruins', 'Ruines Anciennes', 'Vous tombez sur des ruines anciennes cachées dans la nature.', 'discovery',
 'https://images.unsplash.com/photo-1564982752979-3f7c7f2f7063?q=80&w=800&auto=format&fit=crop',
 null),
 
('village_elder', 'Ancien du Village', 'Un villageois âgé s''approche, cherchant de l''aide pour des problèmes locaux.', 'dialogue',
 'https://images.unsplash.com/photo-1578307365821-e4ec081ca57a?q=80&w=800&auto=format&fit=crop',
 null),
 
('traveling_trader', 'Marchand Ambulant', 'Un marchand aux marchandises exotiques vous propose de commercer.', 'merchant',
 'https://images.unsplash.com/photo-1528385676307-0a7831e34cfc?q=80&w=800&auto=format&fit=crop',
 null),
 
('dragon', 'Dragon Ancien', 'Un dragon imposant bloque votre chemin, gardant un trésor précieux.', 'boss',
 'https://images.unsplash.com/photo-1577493340887-b7bfff550145?q=80&w=800&auto=format&fit=crop',
 '[{"enemy_id": "ancient_dragon"}]');

-- Insert choices (a few examples)
INSERT INTO choices (choice_id, event_id, text, required_attributes, required_items, attribute_changes, items_gained, items_lost, next_event_type) VALUES
('fight_bandits', 'bandit_ambush', 'Combattre les bandits', null, null, '{"health": -2}', '["health_potion"]', null, null),
('flee_bandits', 'bandit_ambush', 'Tenter de fuir', '{"agility": 5}', null, '{"health": -1}', null, null, null),
('negotiate_bandits', 'bandit_ambush', 'Essayer de négocier', '{"charisma": 6}', null, null, null, '["iron_sword"]', null),

('explore_ruins', 'ancient_ruins', 'Explorer les ruines', null, null, '{"intelligence": 1}', null, null, 'merchant'),
('study_inscriptions', 'ancient_ruins', 'Étudier les inscriptions mystérieuses', '{"intelligence": 6}', null, '{"intelligence": 2}', null, null, 'discovery'),
('bypass_ruins', 'ancient_ruins', 'Continuer votre voyage', null, null, null, null, null, 'dialogue'),

('fight_dragon', 'dragon', 'Affronter le dragon', '{"strength": 8}', null, '{"health": -5, "strength": 2}', '["health_potion"]', null, null),
('sneak_past_dragon', 'dragon', 'Essayer de se faufiler', '{"agility": 7}', null, '{"agility": 1}', null, null, null),
('negotiate_dragon', 'dragon', 'Tenter de communiquer avec le dragon', '{"intelligence": 8, "charisma": 7}', null, '{"intelligence": 2, "charisma": 2}', null, null, null);

-- Insert victory conditions
INSERT INTO victory_conditions (required_attributes, required_items, message) VALUES
('{"strength": 10, "intelligence": 10, "charisma": 10}', '[]', 'Vos capacités extraordinaires vous ont permis de devenir une légende. Le royaume est à vous!');

-- Insert defeat conditions
INSERT INTO defeat_conditions (health_threshold, message) VALUES
(0, 'Vos blessures étaient trop graves. Votre aventure se termine ici.');
