import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { DeepPartial } from 'react-hook-form';
import type { LocalGameFormSchema } from '../local/setup/_components/form';

const baseGameSettingsAtom = atomWithStorage<LocalGameFormSchema>(
  'gameSettings',
  {
    players: [],
    numberOfSpies: '1',
    randomNumberOfSpies: false,
  },
);

export const gameSettingsAtom = atom(
  (get) => get(baseGameSettingsAtom),
  (
    get,
    set,
    update:
      | DeepPartial<LocalGameFormSchema>
      | ((prev: LocalGameFormSchema) => LocalGameFormSchema),
  ) => {
    const newValue =
      typeof update === 'function' ? update(get(baseGameSettingsAtom)) : update;
    set(baseGameSettingsAtom, {
      players: (newValue.players ?? []).map((player) => ({
        name: player?.name ?? '',
      })),
      numberOfSpies: newValue.numberOfSpies ?? '1',
      randomNumberOfSpies: newValue.randomNumberOfSpies ?? false,
    });
  },
);
