import { type FC, useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/dictionaries';
import { cn } from '@/lib/cls';
import { Button } from '@/primitives/components/ui/button';

const transitionClass = 'duration-700';
// biome-ignore lint/style/noNonNullAssertion: Trust me bro
const changeOnMs = Number(transitionClass.split('-')[1]!) / 3;

export const GameCard: FC<{
  player: { name: string; isSpy: boolean };
  onFinishCheck: () => void;
  word: string;
  dict: Dictionary;
}> = ({ player, word, onFinishCheck, dict }) => {
  const haveSeenContent = useRef(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: onFinishCheck is not needed as dependency
  useEffect(() => {
    if (!haveSeenContent.current) {
      return () => null;
    }

    if (isFlipped) {
      return () => null;
    }

    const timeout = setTimeout(onFinishCheck, changeOnMs);

    return () => clearTimeout(timeout);
  }, [isFlipped]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      haveSeenContent.current = true;
    }
  };

  return (
    <Button
      className="bg-transparent hover:bg-transparent"
      asChild
      onClick={handleFlip}>
      <div className="perspective-midrange relative h-96 w-80 cursor-pointer border-0">
        <div
          className={cn(
            'transform-3d relative h-full w-full transition-transform',
            transitionClass,
            {
              'rotate-y-180': isFlipped,
            },
          )}>
          {/* Front Face - Player Name */}
          <div className="backface-hidden absolute flex h-full w-full items-center justify-center rounded-xl border-2 border-border bg-card shadow-lg">
            <h3 className="font-bold text-4xl text-foreground">
              {player.name}
            </h3>
          </div>

          {/* Back Face - Role Reveal */}
          <div className="backface-hidden absolute flex h-full w-full rotate-y-180 flex-col items-center justify-center rounded-xl border-2 border-border bg-card shadow-lg">
            {player.isSpy ? (
              <>
                <div className="mb-4 text-6xl">🕵</div>
                <h3 className="font-bold text-4xl text-destructive">
                  {dict.card.spy}
                </h3>
              </>
            ) : (
              <>
                <div className="mb-4 text-6xl">👤</div>
                <h3 className="font-bold text-4xl text-primary">{word}</h3>
                <p className="mt-2 text-muted-foreground">{dict.card.notSpy}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </Button>
  );
};
