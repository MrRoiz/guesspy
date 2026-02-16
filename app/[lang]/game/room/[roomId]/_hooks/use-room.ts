import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import z from 'zod';
import { supabase } from '@/_clients/supabase';

const supabaseClient = supabase();

type GamePhase = 'lobby' | 'playing' | 'timer';

export type Player = {
  id: string;
  name: string;
  joinedAt: number;
  isHost: boolean;
};

type PlayerWithRole = Player & { isSpy: boolean };

// Zod schema for user state in presence
const userState = z.object({
  name: z.string(),
  joinedAt: z.number(),
});

// Zod schema for presence state (map of player id to array of user states)
const presenseState = z.record(z.string(), z.array(userState));

const gameStartedEvent = z.object({
  word: z.string(),
  spyIds: z.array(z.string()),
});

const playerReadyEvent = z.object({
  playerId: z.string(),
});

const spiesRevealedEvent = z.object({
  show: z.boolean(),
});

type UseRoom = (params: { roomId: string }) => {
  setPlayer: (name: string) => void;
  player: string | undefined;
  playerId: string | undefined;
  players: Player[];
  isHost: boolean;
  gamePhase: GamePhase;
  word: string | undefined;
  playerRoles: PlayerWithRole[];
  startGame: (word: string, numberOfSpies: number) => void;
  playAgain: () => void;
  markPlayerReady: () => void;
  stopTimer: () => void;
  isTimerStopped: boolean;
  allPlayersChecked: boolean;
  readyPlayers: Set<string>;
  showSpies: boolean;
  toggleSpies: () => void;
};

export const useRoom: UseRoom = ({ roomId }) => {
  const [player, setPlayer] = useState<string>();
  const [playerId, setPlayerId] = useState<string>();
  const channel = useRef(supabaseClient.channel(roomId));
  const [players, setPlayers] = useState<Player[]>([]);
  const [gamePhase, setGamePhase] = useState<GamePhase>('lobby');
  const [word, setWord] = useState<string>();
  const [spyIds, setSpyIds] = useState<string[]>([]);
  const [readyPlayers, setReadyPlayers] = useState<Set<string>>(new Set());
  const [isTimerStopped, setIsTimerStopped] = useState(false);
  const [showSpies, setShowSpies] = useState(false);
  const joinedAtRef = useRef<number>(0);

  // Derive host from players - the player who joined first is the host
  const isHost = useMemo(() => {
    if (!playerId || players.length === 0) {
      return false;
    }
    // Sort by joinedAt to find the earliest player
    const sortedPlayers = [...players].sort((a, b) => a.joinedAt - b.joinedAt);
    return sortedPlayers[0]?.id === playerId;
  }, [playerId, players]);

  const playersWithHost = useMemo((): Player[] => {
    if (players.length === 0) {
      return [];
    }
    // Sort by joinedAt to find the earliest player
    const sortedPlayers = [...players].sort((a, b) => a.joinedAt - b.joinedAt);
    const hostId = sortedPlayers[0]?.id;

    return players.map((p) => ({
      ...p,
      isHost: p.id === hostId,
    }));
  }, [players]);

  const playerRoles = useMemo((): PlayerWithRole[] => {
    return playersWithHost.map((p) => ({
      ...p,
      isSpy: spyIds.includes(p.id),
    }));
  }, [playersWithHost, spyIds]);

  const allPlayersChecked = useMemo(() => {
    return players.length > 0 && players.every((p) => readyPlayers.has(p.id));
  }, [players, readyPlayers]);

  // When all players have checked their cards during 'playing' phase, transition to 'timer' phase
  useEffect(() => {
    if (gamePhase !== 'playing' || !allPlayersChecked) {
      return;
    }

    // Broadcast that all players are ready (any player can trigger this)
    channel.current.send({
      type: 'broadcast',
      event: 'all_players_ready',
    });

    // Also update local state immediately
    setGamePhase('timer');
  }, [allPlayersChecked, gamePhase]);

  // Listen for broadcast events
  useEffect(() => {
    if (!channel.current || !player) {
      return () => undefined;
    }

    // Store joinedAt time for this player
    joinedAtRef.current = Date.now();

    const subscription = channel.current
      .on('presence', { event: 'sync' }, () => {
        const presenceState = Object.entries(
          presenseState.parse(channel.current.presenceState()),
        );

        const updatedPlayers = presenceState.map(([id, statePlayer]) => ({
          id,
          name: statePlayer[0].name,
          joinedAt: statePlayer[0].joinedAt,
          isHost: false, // Will be computed in playersWithHost
        }));

        setPlayers(updatedPlayers);

        // Find our own player ID based on name and joinedAt
        const ownPlayer = updatedPlayers.find(
          (p) => p.name === player && p.joinedAt === joinedAtRef.current,
        );
        if (ownPlayer) {
          setPlayerId(ownPlayer.id);
        }
      })
      .on('broadcast', { event: 'game_started' }, ({ payload }) => {
        const parsed = gameStartedEvent.safeParse(payload);
        if (!parsed.success) {
          return;
        }
        const event = parsed.data;

        setWord(event.word);
        setSpyIds(event.spyIds);
        setGamePhase('playing');
        setReadyPlayers(new Set());
        setIsTimerStopped(false);
        setShowSpies(false);
      })
      .on('broadcast', { event: 'play_again' }, () => {
        setWord(undefined);
        setSpyIds([]);
        setGamePhase('lobby');
        setReadyPlayers(new Set());
        setIsTimerStopped(false);
        setShowSpies(false);
      })
      .on('broadcast', { event: 'all_players_ready' }, () => {
        setGamePhase('timer');
      })
      .on('broadcast', { event: 'player_ready' }, ({ payload }) => {
        const parsed = playerReadyEvent.safeParse(payload);
        if (!parsed.success) {
          return;
        }
        const event = parsed.data;

        setReadyPlayers((prev) => {
          const newSet = new Set(prev);
          newSet.add(event.playerId);
          return newSet;
        });
      })
      .on('broadcast', { event: 'timer_stopped' }, () => {
        setIsTimerStopped(true);
      })
      .on('broadcast', { event: 'spies_revealed' }, ({ payload }) => {
        const parsed = spiesRevealedEvent.safeParse(payload);
        if (!parsed.success) {
          return;
        }
        setShowSpies(parsed.data.show);
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') {
          return;
        }

        await channel.current.track({
          name: player,
          joinedAt: joinedAtRef.current,
        } satisfies z.infer<typeof userState>);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [player]);

  const startGame = useCallback(
    (word: string, numberOfSpies: number) => {
      if (!isHost || players.length < 3) {
        return;
      }

      // Generate random spy indices
      const spyIndices = new Set<number>();
      while (
        spyIndices.size < numberOfSpies &&
        spyIndices.size < players.length
      ) {
        spyIndices.add(Math.floor(Math.random() * players.length));
      }

      const selectedSpyIds = players
        .filter((_, index) => spyIndices.has(index))
        .map((p) => p.id);

      channel.current.send({
        type: 'broadcast',
        event: 'game_started',
        payload: {
          word,
          spyIds: selectedSpyIds,
        } satisfies z.infer<typeof gameStartedEvent>,
      });

      // Also update local state immediately
      setWord(word);
      setSpyIds(selectedSpyIds);
      setGamePhase('playing');
      setReadyPlayers(new Set());
      setIsTimerStopped(false);
      setShowSpies(false);
    },
    [isHost, players],
  );

  const playAgain = useCallback(() => {
    if (!isHost) {
      return;
    }

    channel.current.send({
      type: 'broadcast',
      event: 'play_again',
    });

    // Also update local state immediately
    setWord(undefined);
    setSpyIds([]);
    setGamePhase('lobby');
    setReadyPlayers(new Set());
    setIsTimerStopped(false);
    setShowSpies(false);
  }, [isHost]);

  const markPlayerReady = useCallback(() => {
    if (!playerId) {
      return;
    }

    // Broadcast that this player is ready
    channel.current.send({
      type: 'broadcast',
      event: 'player_ready',
      payload: {
        playerId,
      } satisfies z.infer<typeof playerReadyEvent>,
    });

    // Also update local state immediately
    setReadyPlayers((prev) => {
      const newSet = new Set(prev);
      newSet.add(playerId);
      return newSet;
    });
  }, [playerId]);

  const stopTimer = useCallback(() => {
    if (!isHost) {
      return;
    }

    // Broadcast that the timer was stopped
    channel.current.send({
      type: 'broadcast',
      event: 'timer_stopped',
    });

    // Also update local state immediately
    setIsTimerStopped(true);
  }, [isHost]);

  const toggleSpies = useCallback(() => {
    if (!isHost) {
      return;
    }

    const newShowSpies = !showSpies;

    // Broadcast the new show spies state
    channel.current.send({
      type: 'broadcast',
      event: 'spies_revealed',
      payload: {
        show: newShowSpies,
      },
    });

    // Also update local state immediately
    setShowSpies(newShowSpies);
  }, [isHost, showSpies]);

  return {
    setPlayer,
    player,
    playerId,
    players: playersWithHost,
    isHost,
    gamePhase,
    word,
    playerRoles,
    startGame,
    playAgain,
    markPlayerReady,
    stopTimer,
    isTimerStopped,
    allPlayersChecked,
    readyPlayers,
    showSpies,
    toggleSpies,
  };
};
