import { atom } from 'jotai';
import type z from 'zod';
import type { localGameFormSchema } from '../setup/_components/form';

export const gameSettingsAtom = atom<z.infer<typeof localGameFormSchema>>({
  players: [],
  numberOfSpies: '0',
  randomNumberOfSpies: false,
});
