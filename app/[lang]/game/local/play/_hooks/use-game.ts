'use client';

import { useAtomValue } from 'jotai';
import { useCallback, useMemo, useState } from 'react';
import type { Locale } from '@/dictionaries';
import { gameSettingsAtom } from '@/game/local/_store/game-settings';
import enWords from '@/word-bank/en.json';
import esWords from '@/word-bank/es.json';

type Player = {
  name: string;
  isSpy: boolean;
};

type UseGame = (payload: { lang: Locale }) => {
  word: string;
  playerRoles: Player[];
  currentPlayer: Player;
  currentPlayerIndex: number;
  allPlayersChecked: boolean;
  playAgain: () => void;
  nextPlayer: () => void;
};

export const useGame: UseGame = ({ lang }) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const [gameKey, setGameKey] = useState(0);
  const gameSettings = useAtomValue(gameSettingsAtom);

  // Get random word based on language
  // biome-ignore lint/correctness/useExhaustiveDependencies: gameKey is intentionally used to trigger regeneration
  const word = useMemo(() => {
    const words = lang === 'es' ? esWords : enWords;
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }, [lang, gameKey]);

  // Generate spy assignments
  // biome-ignore lint/correctness/useExhaustiveDependencies: gameKey is intentionally used to trigger regeneration
  const playerRoles = useMemo(() => {
    const { players } = gameSettings;

    let spyCount: number;
    if (gameSettings.randomNumberOfSpies) {
      spyCount = Math.floor(Math.random() * players.length) + 1;
    } else {
      spyCount = Number(gameSettings.numberOfSpies);
    }

    // Create an array with spy indices
    const spyIndices = new Set<number>();
    while (spyIndices.size < spyCount && spyIndices.size < players.length) {
      spyIndices.add(Math.floor(Math.random() * players.length));
    }

    return players.map(({ name }, index) => ({
      name,
      isSpy: spyIndices.has(index),
    }));
  }, [gameSettings, gameKey]);

  const playAgain = useCallback(() => {
    setCurrentPlayerIndex(0);
    setGameKey((prev) => prev + 1);
  }, []);

  const nextPlayer = () => {
    setCurrentPlayerIndex((prev) => prev + 1);
  };

  return {
    word,
    playerRoles,
    allPlayersChecked: currentPlayerIndex >= playerRoles.length,
    currentPlayer: playerRoles[currentPlayerIndex],
    currentPlayerIndex,
    playAgain,
    nextPlayer,
  };
};
