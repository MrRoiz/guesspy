'use client';

import { useAtomValue } from 'jotai';
import { type FC, useCallback, useMemo, useState } from 'react';
import type { Dictionary } from '@/dictionaries';
import { GameCard } from '@/game/_components/card';
import { gameSettingsAtom } from '../../_store/game-settings';
import { GameTimer } from './timer';

export const Game: FC<{ dict: Dictionary }> = ({ dict }) => {
  const gameSettings = useAtomValue(gameSettingsAtom);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  // Generate spy assignments
  // biome-ignore lint/correctness/useExhaustiveDependencies: gameKey is intentionally used to trigger regeneration
  const playerRoles = useMemo(() => {
    const players = gameSettings.players.map((p) => p.name);
    const spyCount = gameSettings.randomNumberOfSpies
      ? Math.floor(Math.random() * players.length) + 1
      : Number(gameSettings.numberOfSpies);

    // Create an array with spy indices
    const spyIndices = new Set<number>();
    while (spyIndices.size < spyCount && spyIndices.size < players.length) {
      spyIndices.add(Math.floor(Math.random() * players.length));
    }

    return players.map((name, index) => ({
      name,
      isSpy: spyIndices.has(index),
    }));
  }, [gameSettings, gameKey]);

  const handlePlayAgain = useCallback(() => {
    setCurrentPlayerIndex(0);
    setGameKey((prev) => prev + 1);
  }, []);

  const allPlayersChecked = currentPlayerIndex >= playerRoles.length;

  // Show timer once all players have checked their cards
  if (allPlayersChecked) {
    return (
      <GameTimer
        playerRoles={playerRoles}
        onPlayAgain={handlePlayAgain}
        dict={dict}
      />
    );
  }

  const currentPlayer = playerRoles[currentPlayerIndex];
  if (!currentPlayer) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>{dict.play.noPlayers}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <div className="text-center">
        <h2 className="mb-2 font-bold text-2xl">
          {dict.play.playerProgress
            .replace('{current}', String(currentPlayerIndex + 1))
            .replace('{total}', String(playerRoles.length))}
        </h2>
        <p className="text-muted-foreground">{dict.play.cardInstruction}</p>
      </div>

      <GameCard
        player={currentPlayer}
        word="WORD"
        dict={dict}
        onFinishCheck={() => setCurrentPlayerIndex(currentPlayerIndex + 1)}
      />
    </div>
  );
};
