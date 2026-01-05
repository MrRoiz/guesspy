import { atom } from 'jotai';
import type { LocalGameFormSchema } from '../setup/_components/form';

export const gameSettingsAtom = atom<LocalGameFormSchema>({
  players: [],
  numberOfSpies: '0',
  randomNumberOfSpies: false,
});
