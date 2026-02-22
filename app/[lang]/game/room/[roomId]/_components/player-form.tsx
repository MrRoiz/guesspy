import { useForm } from '@tanstack/react-form';
import type { FC } from 'react';
import z from 'zod';
import { Button } from '@/_primitives/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/_primitives/components/ui/field';
import { Input } from '@/_primitives/components/ui/input';
import type { Dictionary } from '@/dictionaries';

const formSchema = z.object({
  name: z.string().trim().nonempty('Name is required'),
});

type Props = {
  dict: Dictionary;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
};

export const PlayerForm: FC<Props> = ({ dict, onSubmit }) => {
  const form = useForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onChange: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <form
      className="max-w-[1000px]"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <form.Field name="name">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field>
              <FieldLabel>{dict.room.enterName}</FieldLabel>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
              />
              <FieldDescription>{dict.room.nameDescription}</FieldDescription>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>
      <Button className="mt-4 w-full">{dict.room.joinRoom}</Button>
    </form>
  );
};
