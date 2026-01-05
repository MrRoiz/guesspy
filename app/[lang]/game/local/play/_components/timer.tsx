'use client';

import { type FC, useEffect, useState } from 'react';
import type { Dictionary } from '@/dictionaries';
import { cn } from '@/lib/cls';
import { Button } from '@/primitives/components/ui/button';

const TIMER_DURATION = 120; // 2 minutes in seconds

interface PlayerRole {
  name: string;
  isSpy: boolean;
}

interface GameTimerProps {
  playerRoles: PlayerRole[];
  onPlayAgain: () => void;
  dict: Dictionary;
}

export const GameTimer: FC<GameTimerProps> = ({
  playerRoles,
  onPlayAgain,
  dict,
}) => {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isExpired, setIsExpired] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [showSpies, setShowSpies] = useState(false);

  useEffect(() => {
    if (isStopped) {
      return;
    }

    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isStopped]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const getTimerColor = () => {
    if (isExpired || isStopped) return 'text-destructive';
    if (timeLeft <= 30) return 'text-destructive';
    if (timeLeft <= 60) return 'text-warning';
    return 'text-foreground';
  };

  const isFinished = isExpired || isStopped;

  const spies = playerRoles.filter((player) => player.isSpy);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h2 className="mb-2 font-bold text-2xl">{dict.timer.title}</h2>
          <p className="text-muted-foreground">
            {isFinished ? dict.timer.timeUpDescription : dict.timer.description}
          </p>
        </div>

        <div
          className={cn(
            'flex h-64 w-64 items-center justify-center rounded-full border-4 shadow-lg transition-colors',
            getTimerColor(),
            {
              'animate-pulse border-destructive': isExpired,
              'border-destructive':
                (timeLeft <= 30 && !isFinished) || isStopped,
              'border-warning': timeLeft > 30 && timeLeft <= 60 && !isFinished,
              'border-border': timeLeft > 60 && !isFinished,
            },
          )}>
          <div className="text-center">
            <div className={cn('font-bold text-6xl', getTimerColor())}>
              {formattedTime}
            </div>
            {isFinished && (
              <div className="mt-2 font-semibold text-xl">
                {isExpired ? dict.timer.timeUp : dict.timer.stopped}
              </div>
            )}
          </div>
        </div>

        {!isFinished && (
          <Button variant="outline" onClick={() => setIsStopped(true)}>
            {dict.timer.stopTimer}
          </Button>
        )}
      </div>

      {isFinished && (
        <div className="flex flex-col items-center gap-4">
          {showSpies && (
            <div className="rounded-lg border bg-card p-6 shadow-lg">
              <h3 className="mb-4 font-bold text-xl">{dict.timer.spiesWere}</h3>
              <ul className="space-y-2">
                {spies.map((spy) => (
                  <li key={spy.name} className="text-destructive text-lg">
                    🕵 {spy.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button variant="outline" onClick={() => setShowSpies(!showSpies)}>
              {showSpies ? dict.timer.hideSpies : dict.timer.revealSpies}
            </Button>
            <Button onClick={onPlayAgain}>{dict.timer.playAgain}</Button>
          </div>
        </div>
      )}
    </div>
  );
};
