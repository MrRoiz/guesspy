'use client';

import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FC, useEffect, useRef } from 'react';
import type { Dictionary, Locale } from '@/dictionaries';
import { GameCard } from '@/game/_components/card';
import { MIN_PLAYERS } from '@/game/_constants';
import { useGame } from '@/game/local/play/_hooks/use-game';
import { GameTimer } from './timer';

export const Game: FC<{ dict: Dictionary; lang: Locale }> = ({
  dict,
  lang,
}) => {
  const isRedirectingRef = useRef(false);
  const router = useRouter();
  const {
    word,
    isError,
    isFetching,

    playerRoles,
    playAgain,
    nextPlayer,
    allPlayersChecked,
    currentPlayer,
    currentPlayerIndex,
  } = useGame({ lang });

  useEffect(() => {
    if (playerRoles.length >= 3) {
      return;
    }

    if (isRedirectingRef.current) {
      return;
    }
    isRedirectingRef.current = true;
    router.push('/');
  }, [playerRoles, router.push]);

  if (playerRoles.length < MIN_PLAYERS) {
    return (
      <div className="flex flex-col items-center gap-5">
        <h2 className="text-2xl">{dict.app.redirecting}</h2>
        <LoaderCircle size={100} className="animate-spin text-primary" />
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="flex flex-col items-center gap-5">
        <h2 className="text-2xl">{dict.game.retrievingWord}</h2>
        <LoaderCircle size={100} className="animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !word) {
    return <h2 className="text-2xl">{dict.game.errorRetrievingWord}</h2>;
  }

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
