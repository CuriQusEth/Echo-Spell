import React from 'react';
import { useGame } from '../../store/gameStore';
import { motion } from 'framer-motion';

export const Leaderboard: React.FC = () => {
    const { setGameState, highestCombo, score } = useGame();

    // Mock leaderboard data (would fetch via Wagmi / indexer normally)
    const mockData = [
        { address: '0x1234...ABCD', score: 1540300, combo: 104 },
        { address: '0x9999...1111', score: 890000, combo: 80 },
        { address: '0xAAAA...BBBB', score: 760000, combo: 65 },
        { address: 'YOU (Local)', score: score, combo: highestCombo }
    ].sort((a, b) => b.score - a.score);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-white bg-slate-950"
        >
            <h1 className="mb-10 text-4xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                GREATEST ECHO SORCERERS
            </h1>

            <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800 text-slate-400">
                            <th className="p-4 font-semibold">Rank</th>
                            <th className="p-4 font-semibold">Sorcerer (Address)</th>
                            <th className="p-4 font-semibold text-right">Max Combo</th>
                            <th className="p-4 font-semibold text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockData.map((row, idx) => (
                            <tr key={idx} className={`border-t border-slate-800 ${row.address.startsWith('YOU') ? 'bg-cyan-900/40 text-cyan-200' : ''}`}>
                                <td className="p-4 font-mono font-bold text-fuchsia-400">#{idx + 1}</td>
                                <td className="p-4 font-mono text-sm">{row.address}</td>
                                <td className="p-4 text-right font-mono text-amber-400">{row.combo}x</td>
                                <td className="p-4 text-right font-mono font-bold tracking-wider">{row.score.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                onClick={() => setGameState('MENU')}
                className="px-8 py-3 mt-10 font-bold tracking-widest uppercase transition border rounded-xl border-cyan-500 hover:bg-cyan-900/30"
            >
                Back to Citadel
            </button>
        </motion.div>
    );
};
