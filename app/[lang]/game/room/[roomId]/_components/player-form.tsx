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
    resolver: zodResolver(formSchema),
  });

  return (
    <form className="max-w-[1000px]" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>{dict.room.enterName}</FieldLabel>
            <Input {...field} aria-invalid={fieldState.invalid} />
            <FieldDescription>{dict.room.nameDescription}</FieldDescription>
            <FieldError />
          </Field>
        )}
      />
      <Button className="mt-4 w-full">{dict.room.joinRoom}</Button>
    </form>
  );
};
