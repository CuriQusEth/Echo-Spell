import React from 'react';
import { useGame } from '../../store/gameStore';
import { motion } from 'framer-motion';
import { useAccount, useSignMessage } from 'wagmi';
import { submitToTrustlessAgent, generateAgentTaskSignature } from '../../lib/erc8004';
import { GMButton } from '../GMButton';

export const GameOver: React.FC = () => {
    const { score, highestCombo, setGameState } = useGame();
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);

    const handleRecordPerformance = async () => {
        if (!isConnected || !address) {
            alert('Please connect your wallet.');
            return;
        }

        try {
            setIsSubmitting(true);
            
            // Generate SIWE-like signature payload
            const signPayload = `Echo Spells Verification\nScore: ${score}\nMax Combo: ${highestCombo}\nTimestamp: ${Date.now()}`;
            
            // Request signature
            const signature = await signMessageAsync({ account: address, message: signPayload });
            
            // Mock ERC-8004 submission
            const task = generateAgentTaskSignature(score);
            await submitToTrustlessAgent('echo_leaderboard_agent', {
                score,
                signature,
                task
            });

            setSubmitted(true);
        } catch (error: any) {
            console.error('Failed to submit score:', error);
            if (error?.message?.includes('User rejected')) {
                alert('Signature request rejected.');
            } else {
                alert('Failed to submit score to chain.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center text-white bg-black/90 backdrop-blur-md"
        >
            <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-6 text-5xl font-black text-rose-500 drop-shadow-[0_0_20px_rgba(255,0,0,0.6)]"
            >
                REALM OVERWHELMED
            </motion.h1>

            <div className="w-full max-w-md p-8 mb-8 border rounded-2xl bg-slate-900/50 border-rose-500/30">
                <div className="flex justify-between mb-4 text-xl">
                    <span className="text-slate-400">Final Score:</span>
                    <span className="font-mono text-cyan-400">{score.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl">
                    <span className="text-slate-400">Max Combo:</span>
                    <span className="font-mono text-fuchsia-400">{highestCombo}x</span>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                {!submitted ? (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRecordPerformance}
                        disabled={isSubmitting}
                        className="w-full px-8 py-4 font-bold text-white uppercase transition rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-[0_0_15px_rgba(139,92,246,0.5)] disabled:opacity-50"
                    >
                        {isSubmitting ? 'Casting to Base Denim...' : 'Record Performance On-Chain'}
                    </motion.button>
                ) : (
                    <div className="w-full p-4 font-bold text-emerald-400 border border-emerald-500 rounded-xl bg-emerald-500/10">
                        Legend Immortalized on Base Mainnet (Denim)!
                    </div>
                )}

                <div className="flex items-center gap-4 w-full">
                    <GMButton />
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setGameState('MENU')}
                        className="flex-1 px-8 py-4 font-bold tracking-wider text-white uppercase transition border rounded-xl border-slate-700 hover:bg-slate-800"
                    >
                        Return to Sanctum
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};
