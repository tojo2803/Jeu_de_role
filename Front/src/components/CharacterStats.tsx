
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Sword, 
  Brain, 
  Speech, 
  Wind, 
  Heart, 
  User, 
  ShieldCheck, 
  Scroll, 
  FlaskConical, 
  Key, 
  Gem 
} from 'lucide-react';
import { Character } from '../context/GameContext';
import { ItemType } from '../data/gameData';

interface CharacterStatsProps {
  character: Character;
}

const CharacterStats: React.FC<CharacterStatsProps> = ({ character }) => {
  // Get icon based on attribute name
  const getAttributeIcon = (attr: string) => {
    switch (attr) {
      case 'strength':
        return <Sword size={16} />;
      case 'intelligence':
        return <Brain size={16} />;
      case 'charisma':
        return <Speech size={16} />;
      case 'agility':
        return <Wind size={16} />;
      case 'health':
        return <Heart size={16} />;
      default:
        return <User size={16} />;
    }
  };

  // Get icon based on item type
  const getItemIcon = (type: ItemType) => {
    switch (type) {
      case 'weapon':
        return <Sword size={16} />;
      case 'armor':
        return <ShieldCheck size={16} />;
      case 'consumable':
        return <FlaskConical size={16} />;
      case 'key':
        return <Key size={16} />;
      case 'treasure':
        return <Gem size={16} />;
      default:
        return <Scroll size={16} />;
    }
  };

  // Translate attribute names to French
  const translateAttribute = (attr: string): string => {
    const translations: Record<string, string> = {
      'strength': 'Force',
      'intelligence': 'Intelligence',
      'charisma': 'Charisme',
      'agility': 'Agilité',
      'health': 'Santé'
    };
    
    return translations[attr] || attr;
  };

  return (
    <Card className="glass w-full animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src={character.avatar}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardTitle>{character.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Character attributes - simplified version */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Attributs</h3>
          <div className="space-y-2">
            {Object.entries(character.attributes).map(([attr, value]) => (
              <div key={attr} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    {getAttributeIcon(attr)}
                    <span className="text-xs capitalize">{translateAttribute(attr)}</span>
                  </div>
                  <span className="text-xs font-medium">{value}</span>
                </div>
                <Progress value={value * 10} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Character items - simplified list */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Inventaire ({character.items.length})</h3>
          <div className="grid grid-cols-1 gap-2">
            {character.items.map((item) => (
              <div 
                key={item.id}
                className="bg-white/30 rounded p-2 text-xs flex items-center gap-1.5 border border-white/10"
              >
                {getItemIcon(item.type)}
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CharacterStats;
