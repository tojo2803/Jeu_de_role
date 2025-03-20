
import { GameProvider } from '../context/GameContext';
import Game from './Game';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <Game />
      </GameProvider>
    </QueryClientProvider>
  );
};

export default Index;
