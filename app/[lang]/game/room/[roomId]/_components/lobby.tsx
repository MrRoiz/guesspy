'use client';

import { Crown, Dot, Users } from 'lucide-react';
import type { FC } from 'react';
import type { Dictionary, Locale } from '@/dictionaries';
import { MIN_PLAYERS } from '@/game/_constants';
import { useRoom } from '@/game/room/[roomId]/_hooks/use-room';
import { PlayerForm } from './player-form';
import { RoomGame } from './room-game';
import { RoomTimer } from './room-timer';
import { StartGameForm } from './start-game-form';

export const Lobby: FC<{
  dict: Dictionary;
  lang: Locale;
  roomId: string;
}> = ({ dict, lang, roomId }) => {
  const {
    setPlayer,
    player,
    playerId,
    players,
    isHost,
    gamePhase,
    word,
    playerRoles,
    startGame,
    playAgain,
    markPlayerReady,
    allPlayersChecked,
    readyPlayers,
    stopTimer,
    isTimerStopped,
  } = useRoom({ roomId });

  if (!player) {
    return <PlayerForm dict={dict} onSubmit={(data) => setPlayer(data.name)} />;
  }

  if (gamePhase === 'playing' && word && playerId) {
    return (
      <RoomGame
        dict={dict}
        playerRoles={playerRoles}
        currentPlayerId={playerId}
        word={word}
        onFinishCheck={markPlayerReady}
        allPlayersChecked={allPlayersChecked}
        readyPlayers={readyPlayers}
      />
    );
  }

  if (gamePhase === 'timer') {
    return (
      <RoomTimer
        dict={dict}
        playerRoles={playerRoles}
        onPlayAgain={playAgain}
        isHost={isHost}
        onStopTimer={stopTimer}
        isTimerStopped={isTimerStopped}
      />
    );
  }

  const canStartGame = isHost && players.length >= MIN_PLAYERS;

  return (
    <div className="flex w-full max-w-md flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold text-2xl">
            <Users size={24} />
            {dict.room.players}
          </h2>
          <div className="flex items-center">
            <Dot size={50} className="animate-pulse text-green-400" />
            <p className="text-muted-foreground text-sm">
              {dict.room.waitingForPlayers}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <ul className="space-y-2">
            {players.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                <span className="font-medium">
                  {p.name}
                  {p.id === playerId && (
                    <span className="ml-2 text-muted-foreground text-sm">
                      ({dict.room.you})
                    </span>
                  )}
                </span>
                {p.isHost && <Crown size={18} className="text-yellow-500" />}
              </li>
            ))}
          </ul>

          {players.length < MIN_PLAYERS && (
            <p className="mt-4 text-center text-muted-foreground text-sm">
              {dict.room.needMorePlayers.replace(
                '{count}',
                String(MIN_PLAYERS - players.length),
              )}
            </p>
          )}
        </div>
      </div>

      {isHost && (
        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-4 font-semibold text-lg">
            {dict.room.hostControls}
          </h3>
          <StartGameForm
            dict={dict}
            lang={lang}
            maxSpies={Math.max(1, players.length - 1)}
            onStartGame={startGame}
            disabled={!canStartGame}
          />
          {!canStartGame && players.length < MIN_PLAYERS && (
            <p className="mt-2 text-center text-muted-foreground text-sm">
              {dict.room.waitingForMorePlayers}
            </p>
          )}
        </div>
      )}

      {!isHost && (
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-muted-foreground">
            {dict.room.waitingForHostToStart}
          </p>
        </div>
      )}
    </div>
  );
};
