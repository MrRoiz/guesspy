'use client';

import { useForm, useStore } from '@tanstack/react-form';
import { useAtom } from 'jotai';
import { Plus, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FC, useMemo } from 'react';
import z from 'zod';
import type { Dictionary } from '@/dictionaries';
import { MIN_PLAYERS } from '@/game/_constants';
import { gameSettingsAtom } from '@/game/_store/game-settings';
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

export type LocalGameFormType = {
  players: { name: string }[];
  numberOfSpies: string;
  randomNumberOfSpies: boolean;
};

const defaultValues: LocalGameFormType = {
  players: Array.from({ length: MIN_PLAYERS }).map(() => ({ name: '' })),
  numberOfSpies: '1',
  randomNumberOfSpies: false,
};

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
  const router = useRouter();
  const [gameSettings, setGameSettings] = useAtom(gameSettingsAtom);
  const schema = useMemo(() => createLocalGameFormSchema(dict), [dict]);

  const form = useForm({
    defaultValues: gameSettings,
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    listeners: {
      onChange: ({ formApi }) => {
        if (formApi.state.isDirty) {
          setGameSettings(formApi.state.values);
        }
      },
    },
    onSubmit: ({ value }) => {
      setGameSettings(value);
      router.push(`/${lang}/game/local/play`);
    },
  });

  const randomNumberOfSpies = useStore(
    form.store,
    (state) => state.values.randomNumberOfSpies,
  );

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}>
        <FieldSet>
          <FieldLegend>{dict.setup.title}</FieldLegend>
          <FieldDescription>
            {dict.setup.description.replace(
              '{minPlayers}',
              String(MIN_PLAYERS),
            )}
          </FieldDescription>
          <FieldGroup>
            <form.Field name="numberOfSpies">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="flex sm:flex-row">
                    <FieldLabel>{dict.setup.numberOfSpies}</FieldLabel>
                    <div>
                      <Input
                        disabled={randomNumberOfSpies}
                        placeholder={dict.setup.numberOfSpiesPlaceholder}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={() => field.handleBlur()}
                        type="number"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </div>
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="randomNumberOfSpies">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex justify-between">
                      <FieldLabel>{dict.setup.randomNumberOfSpies}</FieldLabel>
                      <div>
                        <Checkbox
                          onCheckedChange={(checked) => {
                            field.handleChange(Boolean(checked));
                          }}
                          checked={field.state.value}
                        />
                      </div>
                    </div>
                    {field.state.value && (
                      <small className="text-yellow-400">
                        {dict.setup.randomWarning}
                      </small>
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="players">
              {(fields) =>
                fields.state.value.map((_, index) => (
                  <form.Field
                    name={`players[${index}].name`}
                    // biome-ignore lint/suspicious/noArrayIndexKey: There's no better unique identifier for these fields
                    key={index}>
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field
                          data-invalid={isInvalid}
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
                                value={field.state.value}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                                aria-invalid={isInvalid}
                                placeholder={dict.setup.playerPlaceholder.replace(
                                  '{index}',
                                  String(index + 1),
                                )}
                              />
                              {fields.state.value.length > MIN_PLAYERS && (
                                <InputGroupAddon align="inline-end">
                                  <InputGroupButton
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => fields.removeValue(index)}
                                    aria-label={dict.setup.removePlayer.replace(
                                      '{index}',
                                      String(index + 1),
                                    )}>
                                    <XIcon />
                                  </InputGroupButton>
                                </InputGroupAddon>
                              )}
                            </InputGroup>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </div>
                        </Field>
                      );
                    }}
                  </form.Field>
                ))
              }
            </form.Field>
            <div className="flex gap-2 *:flex-1">
              <Button
                variant="outline"
                type="button"
                onClick={() => form.pushFieldValue('players', { name: '' })}>
                <Plus />
                {dict.setup.addPlayer}
              </Button>
            </div>
            <div className="flex gap-2 *:flex-1">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  form.reset(defaultValues);
                  setGameSettings(defaultValues);
                }}>
                <XIcon />
                {dict.setup.clear}
              </Button>
              <Button>{dict.setup.play}</Button>
            </div>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
};
