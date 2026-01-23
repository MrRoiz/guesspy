'use client';

import { useAtomValue } from 'jotai';
import { useCallback, useMemo, useState } from 'react';
import type { Locale } from '@/dictionaries';
import { gameSettingsAtom } from '@/game/local/_store/game-settings';
import { useGetRandomWord } from './use-get-random-word';

type Player = {
  name: string;
  isSpy: boolean;
};

type UseGame = (payload: { lang: Locale }) => {
  word: string | undefined;
  isFetching: boolean;
  isError: boolean;

  playerRoles: Player[];
  currentPlayer: Player;
  currentPlayerIndex: number;
  allPlayersChecked: boolean;
  playAgain: () => void;
  nextPlayer: () => void;
};

export const useGame: UseGame = ({ lang }) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const {
    invalidate,
    query: { data, isFetching, isError },
  } = useGetRandomWord(lang);

  const [gameKey, setGameKey] = useState(0);
  const gameSettings = useAtomValue(gameSettingsAtom);

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
    invalidate();
    setCurrentPlayerIndex(0);
    setGameKey((prev) => prev + 1);
  }, [invalidate]);

  const nextPlayer = () => {
    setCurrentPlayerIndex((prev) => prev + 1);
  };

  return {
    word: typeof data === 'string' ? data : undefined,
    isFetching,
    isError,

    playerRoles,
    allPlayersChecked: currentPlayerIndex >= playerRoles.length,
    currentPlayer: playerRoles[currentPlayerIndex],
    currentPlayerIndex,
    playAgain,
    nextPlayer,
  };
};
