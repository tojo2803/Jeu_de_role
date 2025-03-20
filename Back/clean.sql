-- Supprimer les tables dans le bon ordre en tenant compte des dépendances
DROP TABLE IF EXISTS choices CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS enemies CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS avatars CASCADE;
DROP TABLE IF EXISTS character_classes CASCADE;
DROP TABLE IF EXISTS victory_conditions CASCADE;
DROP TABLE IF EXISTS defeat_conditions CASCADE;

-- Supprimer les types ENUM
DROP TYPE IF EXISTS character_attribute CASCADE;
DROP TYPE IF EXISTS character_class CASCADE;
DROP TYPE IF EXISTS avatar_option CASCADE;
DROP TYPE IF EXISTS item_type CASCADE;
DROP TYPE IF EXISTS event_type CASCADE;
DROP TYPE IF EXISTS game_stage CASCADE;
