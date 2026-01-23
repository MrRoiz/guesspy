import { zodResolver } from '@hookform/resolvers/zod';
import type { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/_primitives/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/_primitives/components/ui/field';
import { Input } from '@/_primitives/components/ui/input';

const formSchema = z.object({
  name: z.string().trim().nonempty('Name is required'),
});

type Props = {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
};

export const PlayerForm: FC<Props> = ({ onSubmit }) => {
  const form = useForm({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(formSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input {...field} aria-invalid={fieldState.invalid} />
            <FieldDescription>
              The name you want to use in the room
            </FieldDescription>
            <FieldError />
          </Field>
        )}
      />
      <Button className="mt-4 w-full">Join!</Button>
    </form>
  );
};
