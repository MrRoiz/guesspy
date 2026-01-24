import { useEffect, useRef, useState } from 'react';
import z from 'zod';
import { supabase } from '@/_clients/supabase';

const supabaseClient = supabase();

const userState = z.object({
  presence_ref: z.string().optional(),
  isHost: z.boolean(),
  name: z.string(),
});

const presenseState = z.record(z.string(), userState.array());

type UseRoom = (params: { roomId: string }) => {
  setPlayer: (name: string) => void;
  player: string | undefined;
  players: Array<z.infer<typeof userState> & { id: string }>;
};

export const useRoom: UseRoom = ({ roomId }) => {
  const [player, setPlayer] = useState<string>();
  const channel = useRef(supabaseClient.channel(roomId));
  const [players, setPlayers] = useState<
    Array<z.infer<typeof userState> & { id: string }>
  >([]);

  useEffect(() => {
    if (!channel.current || !player) {
      return () => undefined;
    }

    const subscription = channel.current
      .on('presence', { event: 'sync' }, () => {
        const presenceState = Object.entries(
          presenseState.parse(channel.current.presenceState()),
        );

        setPlayers(
          presenceState.map(([id, statePlayer]) => ({
            id,
            name: statePlayer[0].name,
            isHost: statePlayer[0].isHost,
          })),
        );
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') {
          return;
        }
        const players = Object.values(channel.current.presenceState());

        await channel.current.track({
          name: player,
          isHost: players.length === 0,
        } satisfies z.infer<typeof userState>);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [player]);

  const setPlayerWrapper = (newPlayer: string) => {
    setPlayer(newPlayer);
    setPlayers([
      {
        id: 'PENDING',
        isHost: false,
        name: newPlayer,
      },
    ]);
  };

  return { setPlayer: setPlayerWrapper, player, players };
};
