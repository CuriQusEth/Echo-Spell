import React, { useState } from 'react';
import { useGame } from '../../store/gameStore';
import { CanvasEngine } from '../game/CanvasEngine';
import { motion } from 'framer-motion';

export const GameArena: React.FC = () => {
    const { setGameState, setScore, setHighestCombo, score, highestCombo } = useGame();
    const [health, setHealth] = useState(100);
    const [currentCombo, setCurrentCombo] = useState(0);

    const handleScore = (pts: number) => {
        setScore(s => s + pts);
    };

    const handleCombo = (c: number) => {
        setCurrentCombo(c);
        setHighestCombo(prev => Math.max(prev, c));
    };

    const handleDamage = () => {
        setHealth(h => {
            const newHealth = h - 10;
            if (newHealth <= 0) {
                setTimeout(() => setGameState('GAMEOVER'), 100);
                return 0;
            }
            return newHealth;
        });
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-slate-950">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none opacity-20" 
                 style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #4c1d95 0%, #020617 100%)' }}>
            </div>
            
            {/* The Engine */}
            <CanvasEngine 
                onScore={handleScore} 
                onCombo={handleCombo} 
                onDamage={handleDamage} 
            />

            {/* HUD Overlay */}
            <div className="absolute top-0 left-0 right-0 p-6 pointer-events-none flex justify-between items-start z-10">
                {/* Score & Health */}
                <div className="flex flex-col gap-2">
                    <div className="text-3xl font-mono font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                        {score.toLocaleString()}
                    </div>
                    <div className="w-48 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-red-600 to-rose-400"
                            initial={{ width: '100%' }}
                            animate={{ width: `${health}%` }}
                            transition={{ type: 'spring' }}
                        />
                    </div>
                </div>

                {/* Combo Display */}
                <div className="text-right">
                    <AnimateCombo combo={currentCombo} />
                </div>
            </div>
        </div>
    );
};

const AnimateCombo = ({ combo }: { combo: number }) => {
    if (combo < 2) return null;
    
    // Scale jumps based on combo tier
    let scale = 1;
    let color = 'text-white';
    
    if (combo > 20) { scale = 1.5; color = 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]'; }
    else if (combo > 10) { scale = 1.3; color = 'text-fuchsia-400 drop-shadow-[0_0_10px_rgba(232,121,249,0.8)]'; }
    else if (combo > 5) { scale = 1.1; color = 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]'; }

    return (
        <motion.div
            key={combo} // Force re-animation on combo change
            initial={{ scale: scale * 1.5, opacity: 0 }}
            animate={{ scale, opacity: 1 }}
            className={`text-4xl font-black italic ${color}`}
        >
            {combo}x
        </motion.div>
    );
}
