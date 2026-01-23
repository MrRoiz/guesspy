'use client';

import { type FC, useState } from 'react';
import { PlayerForm } from './player-form';

export const Lobby: FC = () => {
  const [player, setPlayer] = useState<string>();
  const [_word, _setWord] = useState<string>();
  const [_isSpy, _setIsSpy] = useState(false);

  if (!player) {
    return <PlayerForm onSubmit={(data) => setPlayer(data.name)} />;
  }

  return <p>{player}</p>;
};
