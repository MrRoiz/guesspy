'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps, FC } from 'react';

export const ThemeProvider: FC<ComponentProps<typeof NextThemesProvider>> = ({
  children,
  ...props
}) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
