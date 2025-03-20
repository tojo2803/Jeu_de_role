
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';

const GameOverCard: React.FC = () => {
  const { state, resetGame } = useGame();
  const { victory, message } = state;

  return (
    <Card className="w-full max-w-md mx-auto glass animate-scale-in">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
          {victory ? (
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500" />
          )}
        </div>
        <CardTitle className="text-2xl">
          {victory ? 'Victory!' : 'Game Over'}
        </CardTitle>
        <CardDescription className="text-base">
          {message || (victory 
            ? 'Congratulations! You have completed your quest.' 
            : 'Your adventure has come to an end.')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          {victory 
            ? 'Your heroic deeds will be remembered throughout the realm.' 
            : 'Better luck on your next adventure.'}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={resetGame} className="w-full btn-hover">
          Start New Adventure
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GameOverCard;
