'use client';

import type { FC } from 'react';
import type { Dictionary, Locale } from '@/dictionaries';
import { GameCard } from '@/game/_components/card';
import { useGame } from '@/game/local/play/_hooks/use-game';
import { GameTimer } from './timer';

export const Game: FC<{ dict: Dictionary; lang: Locale }> = ({
  dict,
  lang,
}) => {
  const {
    word,
    playerRoles,
    playAgain,
    nextPlayer,
    allPlayersChecked,
    currentPlayer,
    currentPlayerIndex,
  } = useGame({ lang });

  // Show timer once all players have checked their cards
  if (allPlayersChecked) {
    return (
      <GameTimer
        playerRoles={playerRoles}
        onPlayAgain={playAgain}
        dict={dict}
      />
    );
  }

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
        word={word}
        dict={dict}
        onFinishCheck={nextPlayer}
      />
    </div>
  );
};
