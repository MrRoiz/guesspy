'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSetAtom } from 'jotai';
import { Plus, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import z from 'zod';
import type { Dictionary } from '@/dictionaries';
import { Button } from '@/primitives/components/ui/button';
import { Checkbox } from '@/primitives/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/primitives/components/ui/field';
import { Input } from '@/primitives/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/primitives/components/ui/input-group';
import { gameSettingsAtom } from '../../_store/game-settings';

const MIN_PLAYERS = 3;

const createLocalGameFormSchema = (dict: Dictionary) =>
  z
    .object({
      players: z
        .array(
          z.object({
            name: z.string().trim().nonempty(dict.errors.playerNameRequired),
          }),
        )
        .min(MIN_PLAYERS),
      numberOfSpies: z.string(),
      randomNumberOfSpies: z.boolean(),
    })
    .refine(
      ({ numberOfSpies, players, randomNumberOfSpies }) =>
        randomNumberOfSpies || players.length > Number(numberOfSpies),
      {
        message: dict.errors.morePlayersThanSpies,
        path: ['numberOfSpies'],
      },
    );

export const LocalUsersForm: FC<{ dict: Dictionary; lang: string }> = ({
  dict,
  lang,
}) => {
  const localGameFormSchema = createLocalGameFormSchema(dict);
  const form = useForm<z.infer<typeof localGameFormSchema>>({
    defaultValues: {
      players: Array.from({ length: MIN_PLAYERS }).map(() => ({ name: '' })),
      numberOfSpies: '1',
      randomNumberOfSpies: false,
    },
    resolver: zodResolver(localGameFormSchema),
  });

  const {
    fields: players,
    append: addPlayer,
    remove: removePlayer,
  } = useFieldArray({
    control: form.control,
    name: 'players',
  });

  const setGameSettings = useSetAtom(gameSettingsAtom);
  const router = useRouter();

  const randomNumberOfSpies = form.watch('randomNumberOfSpies');

  const handleSubmit = (payload: z.infer<typeof localGameFormSchema>) => {
    setGameSettings(payload);
    router.push(`/${lang}/game/local/play`);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldSet>
          <FieldLegend>{dict.setup.title}</FieldLegend>
          <FieldDescription>
            {dict.setup.description.replace(
              '{minPlayers}',
              String(MIN_PLAYERS),
            )}
          </FieldDescription>
          <FieldGroup>
            <Controller
              control={form.control}
              name="numberOfSpies"
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="flex sm:flex-row">
                  <FieldLabel>{dict.setup.numberOfSpies}</FieldLabel>
                  <div>
                    <Input
                      {...field}
                      disabled={randomNumberOfSpies}
                      placeholder={dict.setup.numberOfSpiesPlaceholder}
                      type="number"
                    />
                    <FieldError errors={[fieldState.error]} />
                  </div>
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="randomNumberOfSpies"
              render={({ field: { value, onChange }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex justify-between">
                    <FieldLabel>{dict.setup.randomNumberOfSpies}</FieldLabel>
                    <div>
                      <Checkbox
                        onCheckedChange={(value) => {
                          onChange(value);
                          form.trigger('numberOfSpies');
                        }}
                        checked={value}
                      />
                    </div>
                  </div>
                  {value && (
                    <small className="text-yellow-400">
                      {dict.setup.randomWarning}
                    </small>
                  )}
                </Field>
              )}
            />
            {players.map((player, index) => (
              <Controller
                key={player.id}
                control={form.control}
                name={`players.${index}.name`}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex sm:flex-row">
                    <FieldLabel>
                      {dict.setup.playerLabel.replace(
                        '{index}',
                        String(index + 1),
                      )}
                    </FieldLabel>
                    <div>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder={dict.setup.playerPlaceholder.replace(
                            '{index}',
                            String(index + 1),
                          )}
                        />
                        {players.length > MIN_PLAYERS && (
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => removePlayer(index)}
                              aria-label={dict.setup.removePlayer.replace(
                                '{index}',
                                String(index + 1),
                              )}>
                              <XIcon />
                            </InputGroupButton>
                          </InputGroupAddon>
                        )}
                      </InputGroup>
                      <FieldError errors={[fieldState.error]} />
                    </div>
                  </Field>
                )}
              />
            ))}
            <div className="flex gap-2 *:flex-1">
              <Button
                variant="outline"
                type="button"
                onClick={() => addPlayer({ name: '' })}>
                <Plus />
                {dict.setup.addPlayer}
              </Button>
              <Button>{dict.setup.play}</Button>
            </div>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
};
