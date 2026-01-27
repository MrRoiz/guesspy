import { atomWithStorage } from 'jotai/utils';
import type { LocalGameFormSchema } from '@/game/local/setup/_components/form';

export const gameSettingsAtom = atomWithStorage<LocalGameFormSchema>(
  'gameSettings',
  {
    players: [],
    numberOfSpies: '1',
    randomNumberOfSpies: false,
  },
);
