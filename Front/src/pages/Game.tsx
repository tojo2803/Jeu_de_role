
import React from 'react';
import { useGame } from '../context/GameContext';
import CharacterCreation from '../components/CharacterCreation';
import CharacterStats from '../components/CharacterStats';
import EventCard from '../components/EventCard';
import GameOverCard from '../components/GameOverCard';
import { Button } from '@/components/ui/button';
import { PlayIcon } from 'lucide-react';

const Game = () => {
  const { state, startGame } = useGame();
  const { stage, character, currentEvent, gameOver } = state;

  // Render different content based on game stage
  const renderGameContent = () => {
    switch (stage) {
      case 'character_creation':
        return <CharacterCreation />;
      
      case 'intro':
        return (
          <div className="w-full max-w-md mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-2xl font-bold">Bienvenue dans l'aventure</h1>
            <p className="text-lg">
              Bonjour, {character?.name}! Votre aventure commence maintenant.
            </p>
            <Button 
              onClick={startGame} 
              className="px-6 py-2 rounded-lg text-lg flex gap-2 items-center"
            >
              <PlayIcon size={20} />
              Commencer
            </Button>
          </div>
        );
      
      case 'playing':
        if (gameOver) {
          return <GameOverCard />;
        }
        
        return (
          <div className="w-full max-w-md mx-auto space-y-6">
            {character && currentEvent && (
              <>
                <CharacterStats character={character} />
                <EventCard event={currentEvent} character={character} />
              </>
            )}
          </div>
        );
        
      case 'game_over':
        return <GameOverCard />;
      
      default:
        return <div>Chargement...</div>;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
      {renderGameContent()}
    </div>
  );
};

export default Game;
