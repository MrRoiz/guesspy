'use client';

import { Dot } from 'lucide-react';
import { type FC, useState } from 'react';
import type { Dictionary, Locale } from '@/dictionaries';
import { useRoom } from '@/game/room/[roomId]/_hooks/use-room';
import { PlayerForm } from './player-form';

export const Lobby: FC<{
  dict: Dictionary;
  lang: Locale;
  roomId: string;
}> = ({ roomId }) => {
  const [_word, _setWord] = useState<string>();
  const [_isSpy, _setIsSpy] = useState(false);
  const { setPlayer, player, players } = useRoom({ roomId });

  if (!player) {
    return <PlayerForm onSubmit={(data) => setPlayer(data.name)} />;
  }

  return (
    <div className="w-1/3">
      <div className="flex items-center justify-between">
        <h2>Players</h2>
        <div className="flex items-center">
          <Dot size={50} className="animate-pulse text-green-400" />
          <p>Waiting for new players</p>
        </div>
      </div>
      {players.map((player) => (
        <p key={player.id}>{player.name}</p>
      ))}
    </div>
  );
};
