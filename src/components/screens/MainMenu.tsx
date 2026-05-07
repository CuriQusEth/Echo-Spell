import React, { useEffect } from 'react';
import { useGame } from '../../store/gameStore';
import { motion } from 'framer-motion';
import { useAccount, useSendTransaction } from 'wagmi';
import { formatAttributionTransactionData } from '../../lib/erc8021';
import { audioAPI } from '../../lib/audio';

export const MainMenu: React.FC = () => {
    const { setGameState, setScore, setHighestCombo } = useGame();
    const { address, isConnected } = useAccount();
    const { sendTransaction, isPending, isSuccess } = useSendTransaction();

    const startGame = () => {
        // Init audio context quietly on first interaction
        try { audioAPI.playHit(0); } catch {}
        
        setScore(0);
        setHighestCombo(0);
        setGameState('PLAYING');
    };

    const handleSayGM = () => {
        if (!isConnected || !address) {
            alert('Please connect your wallet first (Mock integration).');
            return;
        }
        
        // This is where ERC-8021 logic is used for transaction attribution
        // We simulate a basic transaction sending to oneself with data payload
        const data = formatAttributionTransactionData('say_gm');
        
        sendTransaction({
            to: address,
            data,
            value: 0n,
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center text-white"
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Background swirling effect mock */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,0,255,0.1)_0%,transparent_70%)] rounded-full mix-blend-screen mix-blend-lighten blur-[100px] animate-pulse"></div>
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,255,255,0.1)_0%,transparent_70%)] rounded-full mix-blend-screen blur-[80px]"></div>
            </div>

            <div className="z-10 flex flex-col items-center">
                <motion.h1 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 1 }}
                    className="mb-8 text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 drop-shadow-[0_0_15px_rgba(255,0,255,0.5)]"
                >
                    ECHO SPELLS
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-12 text-lg text-fuchsia-200"
                >
                    Become the Echo Sorcerer. Rhythm, Magic, and On-Chain Glory.
                </motion.p>

                <div className="flex flex-col gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,255,255,0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-12 py-4 text-xl font-bold text-slate-900 uppercase tracking-widest bg-gradient-to-r from-cyan-300 to-fuchsia-300 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                        onClick={startGame}
                    >
                        Enter Arena
                    </motion.button>

                    <motion.div className="flex justify-center gap-4 mt-6">
                        <button 
                            onClick={handleSayGM}
                            className="px-6 py-3 text-sm font-semibold tracking-wide text-white transition border border-yellow-400 rounded-lg bg-black/50 hover:bg-yellow-400 hover:text-black"
                        >
                            {isPending ? 'Casting...' : 'Say GM (On-Chain)'}
                        </button>
                        
                        <button 
                            onClick={() => setGameState('LEADERBOARD')}
                            className="px-6 py-3 text-sm font-semibold tracking-wide text-white transition border border-cyan-400 rounded-lg bg-black/50 hover:bg-cyan-400 hover:text-black"
                        >
                            Leaderboard
                        </button>
                    </motion.div>
                    
                    {isSuccess && (
                         <div className="mt-4 text-sm text-green-400 animate-pulse">GM Sent to Base Mainnet!</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
