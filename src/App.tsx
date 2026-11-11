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
import { GMButton } from './components/GMButton';

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
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-medium rounded-lg bg-blue-950/70 border border-blue-500/40 text-blue-200 backdrop-blur-md shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                <span className="font-semibold text-blue-100">Base Denim</span>
                <span className="text-[10px] text-blue-400">200ms</span>
            </div>
            <GMButton />
            {isConnected ? (
                <button 
                    onClick={() => disconnect()}
                    className="px-3.5 py-2 text-xs font-mono font-bold text-cyan-200 border border-cyan-800 bg-cyan-950/60 rounded-lg backdrop-blur-sm hover:bg-cyan-900/40 transition-colors"
                >
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </button>
            ) : (
                <button 
                    onClick={handleConnect}
                    className="px-3.5 py-2 text-xs font-mono font-bold text-amber-200 border border-amber-800 bg-amber-950/60 rounded-lg backdrop-blur-sm animate-pulse hover:bg-amber-900/40 transition-colors"
                >
                    Connect (Base Denim)
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
