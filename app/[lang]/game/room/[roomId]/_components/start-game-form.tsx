'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import type { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
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

type FormValues = z.infer<typeof formSchema>;

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

  const form = useForm<FormValues>({
    defaultValues: {
      numberOfSpies: '1',
      randomNumberOfSpies: false,
    },
    resolver: zodResolver(formSchema),
  });

  const watchRandomSpies = form.watch('randomNumberOfSpies');

  const handleSubmit = async (data: FormValues) => {
    // Get a fresh word
    await invalidate();

    // Wait a bit for the new word to be fetched
    // In a real app, you might want to handle this more elegantly
    if (!word || typeof word !== 'string') {
      return;
    }

    let numberOfSpies: number;
    if (data.randomNumberOfSpies) {
      numberOfSpies = Math.floor(Math.random() * maxSpies) + 1;
    } else {
      numberOfSpies = Math.min(Number(data.numberOfSpies), maxSpies);
    }

    onStartGame(word, numberOfSpies);
  };

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
      onSubmit={form.handleSubmit(handleSubmit)}>
      <Controller
        name="numberOfSpies"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>{dict.setup.numberOfSpies}</FieldLabel>
            <Input
              {...field}
              type="number"
              min={1}
              max={maxSpies}
              disabled={watchRandomSpies}
              aria-invalid={fieldState.invalid}
            />
            <FieldError />
          </Field>
        )}
      />

      <Controller
        name="randomNumberOfSpies"
        control={form.control}
        render={({ field }) => (
          <Field>
            <div className="flex items-center gap-2">
              <Checkbox
                id="randomSpies"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldLabel htmlFor="randomSpies" className="cursor-pointer">
                {dict.setup.randomNumberOfSpies}
              </FieldLabel>
            </div>
            {field.value && (
              <FieldDescription className="mt-1">
                {dict.setup.randomWarning}
              </FieldDescription>
            )}
          </Field>
        )}
      />

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
