import { useForm, useStore } from '@tanstack/react-form';
import { LoaderCircle } from 'lucide-react';
import type { FC } from 'react';
import z from 'zod';
import { Button } from '@/_primitives/components/ui/button';
import { Checkbox } from '@/_primitives/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/_primitives/components/ui/field';
import { Input } from '@/_primitives/components/ui/input';
import type { Dictionary, Locale } from '@/dictionaries';
import { useGetRandomWord } from '@/game/local/play/_hooks/use-get-random-word';

const formSchema = z.object({
  numberOfSpies: z.string().min(1, 'Required'),
  randomNumberOfSpies: z.boolean(),
});

type StartGameFormProps = {
  dict: Dictionary;
  lang: Locale;
  maxSpies: number;
  onStartGame: (word: string, numberOfSpies: number) => void;
  disabled: boolean;
};

export const StartGameForm: FC<StartGameFormProps> = ({
  dict,
  lang,
  maxSpies,
  onStartGame,
  disabled,
}) => {
  const {
    query: { data: word, isFetching, isError },
    invalidate,
  } = useGetRandomWord(lang);

  const form = useForm({
    defaultValues: {
      numberOfSpies: '1',
      randomNumberOfSpies: false,
    },
    validators: {
      onChange: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await invalidate();

      if (!word || typeof word !== 'string') {
        return;
      }

      let numberOfSpies: number;
      if (value.randomNumberOfSpies) {
        numberOfSpies = Math.floor(Math.random() * maxSpies) + 1;
      } else {
        numberOfSpies = Math.min(Number(value.numberOfSpies), maxSpies);
      }

      onStartGame(word, numberOfSpies);
    },
  });

  const watchRandomSpies = useStore(
    form.store,
    (state) => state.values.randomNumberOfSpies,
  );

  if (isError) {
    return (
      <p className="text-center text-destructive">
        {dict.game.errorRetrievingWord}
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <form.Field name="numberOfSpies">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field>
              <FieldLabel>{dict.setup.numberOfSpies}</FieldLabel>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={() => field.handleBlur()}
                type="number"
                min={1}
                max={maxSpies}
                disabled={watchRandomSpies}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="randomNumberOfSpies">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="randomSpies"
                  checked={field.state.value}
                  onCheckedChange={(value) =>
                    field.handleChange(Boolean(value))
                  }
                />
                <FieldLabel htmlFor="randomSpies" className="cursor-pointer">
                  {dict.setup.randomNumberOfSpies}
                </FieldLabel>
              </div>
              {field.state.value && (
                <FieldDescription className="mt-1">
                  {dict.setup.randomWarning}
                </FieldDescription>
              )}
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <Button
        type="submit"
        disabled={disabled || isFetching}
        className="w-full">
        {isFetching ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            {dict.game.retrievingWord}
          </>
        ) : (
          dict.room.startGame
        )}
      </Button>
    </form>
  );
};
