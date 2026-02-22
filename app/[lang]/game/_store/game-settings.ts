import { atomWithStorage } from 'jotai/utils';
import type { LocalGameFormType } from '../local/setup/_components/form';

export const gameSettingsAtom = atomWithStorage<LocalGameFormType>(
  'gameSettings',
  {
    players: [],
    numberOfSpies: '1',
    randomNumberOfSpies: false,
  },
);
