
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CharacterClass, CharacterAttribute } from '../data/gameData';
import { Character, useGame } from '../context/GameContext';
import * as apiService from '../services/apiService';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CharacterCreation = () => {
  const { createCharacter } = useGame();
  const [name, setName] = useState('');
  const [characterClass, setCharacterClass] = useState<CharacterClass>('warrior');
  const { toast } = useToast();

  // Fetch character classes data
  const { data: characterClasses, isLoading: classesLoading } = useQuery({
    queryKey: ['characterClasses'],
    queryFn: apiService.getCharacterClasses,
  });

  // Fetch avatars data
  const { data: avatars, isLoading: avatarsLoading } = useQuery({
    queryKey: ['avatars'],
    queryFn: apiService.getAvatars,
  });

  // Fetch items data
  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ['items'],
    queryFn: apiService.getItems,
  });

  // Handle class change
  const handleClassChange = (newClass: CharacterClass) => {
    setCharacterClass(newClass);
  };

  // Handle character creation submission
  const handleSubmit = () => {
    if (!name || !characterClasses || !avatars || !items) return;
    
    const startingItemsIds = characterClasses[characterClass].startingItems;
    const startingItems = startingItemsIds.map(id => items[id]);
    
    // Create a properly typed attributes object with all required properties
    const baseAttributes = characterClasses[characterClass].baseAttributes;
    const attributes: Record<CharacterAttribute, number> = {
      strength: baseAttributes.strength || 0,
      intelligence: baseAttributes.intelligence || 0,
      charisma: baseAttributes.charisma || 0,
      agility: baseAttributes.agility || 0,
      health: baseAttributes.health || 0
    };
    
    const character: Character = {
      name,
      avatar: avatars[characterClass],
      attributes: attributes,
      items: startingItems
    };
    
    createCharacter(character);
    
    toast({
      title: "Personnage créé",
      description: `${name} est prêt pour l'aventure!`,
    });
  };

  const isLoading = classesLoading || avatarsLoading || itemsLoading;

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-4 animate-fade-in flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 animate-fade-in">
      <Card className="glass">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Créer Votre Personnage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Character Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom du Personnage</Label>
            <Input
              id="name"
              type="text"
              placeholder="Entrez votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/50 border border-white/30"
            />
          </div>
          
          {/* Character Class Selection */}
          {characterClasses && (
            <div className="space-y-3">
              <Label>Classe</Label>
              <RadioGroup 
                defaultValue={characterClass} 
                onValueChange={(value) => handleClassChange(value as CharacterClass)}
                className="grid grid-cols-3 gap-4"
              >
                {Object.entries(characterClasses).map(([classKey, classData]) => (
                  <div 
                    key={classKey} 
                    className={`relative rounded-lg p-4 cursor-pointer transition-all border ${
                      characterClass === classKey 
                        ? 'border-primary bg-primary/10' 
                        : 'border-white/20 hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem 
                      value={classKey} 
                      id={`class-${classKey}`} 
                      className="absolute top-2 right-2"
                    />
                    <div className="text-center">
                      <h3 className="font-semibold text-lg capitalize">{classKey}</h3>
                      <p className="text-xs mt-1">{classData.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={!name || isLoading}
            className="w-full"
          >
            Commencer l'Aventure
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CharacterCreation;
