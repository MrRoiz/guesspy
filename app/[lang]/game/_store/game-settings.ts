import { atom } from 'jotai';
import type { LocalGameFormSchema } from '@/game/local/setup/_components/form';

export const gameSettingsAtom = atom<LocalGameFormSchema>({
  players: [],
  numberOfSpies: '0',
  randomNumberOfSpies: false,
});
