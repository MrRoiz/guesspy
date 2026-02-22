import { CheckCircle, LoaderCircle } from 'lucide-react';
import type { FC } from 'react';
import type { Dictionary } from '@/dictionaries';
import { GameCard } from '@/game/_components/card';

type PlayerWithRole = {
  id: string;
  name: string;
  isSpy: boolean;
  isHost: boolean;
};

type RoomGameProps = {
  dict: Dictionary;
  playerRoles: PlayerWithRole[];
  currentPlayerId: string;
  word: string;
  onFinishCheck: () => void;
  allPlayersChecked: boolean;
  readyPlayers: Set<string>;
};

export const RoomGame: FC<RoomGameProps> = ({
  dict,
  playerRoles,
  currentPlayerId,
  word,
  onFinishCheck,
  allPlayersChecked,
  readyPlayers,
}) => {
  const currentPlayer = playerRoles.find((p) => p.id === currentPlayerId);
  const hasCheckedCard = readyPlayers.has(currentPlayerId);

  if (!currentPlayer) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>{dict.play.noPlayers}</p>
      </div>
    );
  }

  // Show waiting screen while waiting for other players
  if (allPlayersChecked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
        <div className="flex flex-col items-center gap-4">
          <CheckCircle size={80} className="text-green-500" />
          <h2 className="text-center font-bold text-2xl">
            {dict.room.allPlayersReady}
          </h2>
          <p className="text-center text-muted-foreground">
            {dict.room.startingDiscussion}
          </p>
          <LoaderCircle size={40} className="animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Show waiting screen if current player has already checked their card
  if (hasCheckedCard) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
        <div className="flex flex-col items-center gap-4">
          <CheckCircle size={80} className="text-green-500" />
          <h2 className="text-center font-bold text-2xl">
            {dict.room.waitingForOthers}
          </h2>
        </div>

        <div className="mt-4 rounded-lg border bg-card p-4">
          <h3 className="mb-2 font-semibold">{dict.room.playersStatus}</h3>
          <ul className="space-y-1">
            {playerRoles.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-2 text-muted-foreground text-sm">
                {readyPlayers.has(p.id) ? (
                  <CheckCircle size={16} className="text-green-500" />
                ) : (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                <span>{p.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <div className="text-center">
        <h2 className="mb-2 font-bold text-2xl">{dict.room.yourCard}</h2>
        <p className="text-muted-foreground">{dict.play.cardInstruction}</p>
      </div>

      <GameCard
        player={{ name: currentPlayer.name, isSpy: currentPlayer.isSpy }}
        word={word}
        dict={dict}
        onFinishCheck={onFinishCheck}
      />

      <div className="mt-4 rounded-lg border bg-card p-4">
        <h3 className="mb-2 font-semibold">{dict.room.playersStatus}</h3>
        <ul className="space-y-1">
          {playerRoles.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-2 text-muted-foreground text-sm">
              {readyPlayers.has(p.id) ? (
                <CheckCircle size={16} className="text-green-500" />
              ) : (
                <LoaderCircle size={16} className="animate-spin" />
              )}
              <span>{p.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
