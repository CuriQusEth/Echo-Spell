import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Hooks & state will be complex, let's build the scaffolding
export type GameState = 'MENU' | 'PLAYING' | 'GAMEOVER' | 'LEADERBOARD';

interface GlobalState {
  gameState: GameState;
  score: number;
  highestCombo: number;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setHighestCombo: React.Dispatch<React.SetStateAction<number>>;
}

const defaultState: GlobalState = {
  gameState: 'MENU',
  score: 0,
  highestCombo: 0,
  setGameState: () => {},
  setScore: () => {},
  setHighestCombo: () => {},
};

export const GameContext = React.createContext<GlobalState>(defaultState);

export const useGame = () => React.useContext(GameContext);
