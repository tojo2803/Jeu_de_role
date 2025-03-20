
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Event, Choice } from '../data/gameData';
import { Character, useGame } from '../context/GameContext';
import { useQuery } from '@tanstack/react-query';
import * as apiService from '../services/apiService';

interface EventCardProps {
  event: Event;
  character: Character;
}

const EventCard: React.FC<EventCardProps> = ({ event, character }) => {
  const { makeChoice, nextEvent, isLoading } = useGame();

  // Récupérer les données des conditions de victoire et de défaite
  const { data: victoryConditions } = useQuery({
    queryKey: ['victoryConditions'],
    queryFn: apiService.getVictoryConditions
  });

  const { data: defeatConditions } = useQuery({
    queryKey: ['defeatConditions'],
    queryFn: apiService.getDefeatConditions
  });

  // Vérifiez si un personnage répond aux exigences d'un choix
  const meetsRequirements = (character: Character, choice: Choice): boolean => {
    // Vérifiez les exigences d'attributs
    if (choice.requiredAttributes) {
      for (const [attr, value] of Object.entries(choice.requiredAttributes)) {
        if (character.attributes[attr as keyof typeof character.attributes] < value) {
          return false;
        }
      }
    }
    
    // Vérifiez les exigences d'objets
    if (choice.requiredItems && choice.requiredItems.length > 0) {
      for (const itemId of choice.requiredItems) {
        if (!character.items.some(item => item.id === itemId)) {
          return false;
        }
      }
    }
    
    return true;
  };

  // Handle choice selection
  const handleChoice = (choice: Choice) => {
    makeChoice(choice);
  };

  return (
    <Card className="w-full max-w-md mx-auto glass animate-scale-in">
      <CardHeader>
        <CardTitle className="text-xl">{event.title}</CardTitle>
        <CardDescription className="text-base">{event.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Display the outcome if a choice has been made */}
        {event.outcome && (
          <div className="bg-primary/10 p-4 rounded-md border border-primary/20 animate-fade-in">
            <p className="text-sm">{event.outcome}</p>
          </div>
        )}

        {/* Choices section */}
        {!event.choiceMade ? (
          <div className="space-y-3 mt-4">
            <h3 className="font-medium">Options:</h3>
            {event.choices.map((choice) => {
              const isAvailable = meetsRequirements(character, choice);
              return (
                <Button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  disabled={!isAvailable || isLoading}
                  variant={isAvailable ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto py-3"
                >
                  <span>{choice.text}</span>
                </Button>
              );
            })}
          </div>
        ) : (
          <Button 
            onClick={nextEvent} 
            className="w-full mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Chargement..." : "Continuer"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
