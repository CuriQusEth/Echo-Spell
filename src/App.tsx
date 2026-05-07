import React, { useState } from 'react';
import { GameContext, GameState } from './store/gameStore';
import { MainMenu } from './components/screens/MainMenu';
import { GameArena } from './components/screens/GameArena';
import { GameOver } from './components/screens/GameOver';
import { Leaderboard } from './components/screens/Leaderboard';

import { WagmiProvider, useAccount, useConnect, useDisconnect } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';

const queryClient = new QueryClient();

// A simple Connect Wallet button overlay
const ConnectWalletOverlay = () => {
    const { address, isConnected } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    const handleConnect = () => {
        if (connectors && connectors.length > 0) {
            connect({ connector: connectors[0] });
        } else {
            alert("No wallet found! Please install a Web3 wallet (like Metamask or Coinbase Wallet).");
        }
    };

    return (
        <div className="absolute top-4 right-4 z-50">
            {isConnected ? (
                <button 
                    onClick={() => disconnect()}
                    className="px-4 py-2 text-xs font-mono font-bold text-cyan-200 border border-cyan-800 bg-cyan-950/50 rounded-lg backdrop-blur-sm"
                >
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </button>
            ) : (
                <button 
                    onClick={handleConnect}
                    className="px-4 py-2 text-xs font-mono font-bold text-amber-200 border border-amber-800 bg-amber-950/50 rounded-lg backdrop-blur-sm animate-pulse"
                >
                    Connect Wallet (Base)
                </button>
            )}
        </div>
    );
}

const AppContent = () => {
    const [gameState, setGameState] = useState<GameState>('MENU');
    const [score, setScore] = useState(0);
    const [highestCombo, setHighestCombo] = useState(0);

    const store = {
        gameState,
        score,
        highestCombo,
        setGameState,
        setScore,
        setHighestCombo,
    };

    return (
        <GameContext.Provider value={store}>
            {gameState !== 'PLAYING' && <ConnectWalletOverlay />}
            
            {gameState === 'MENU' && <MainMenu />}
            {gameState === 'PLAYING' && <GameArena />}
            {gameState === 'GAMEOVER' && <GameOver />}
            {gameState === 'LEADERBOARD' && <Leaderboard />}
        </GameContext.Provider>
    );
};

export default function App() {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <AppContent />
            </QueryClientProvider>
        </WagmiProvider>
    );
}
