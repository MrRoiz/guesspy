'use client';

import { Provider } from 'jotai';
import type { ComponentProps, FC } from 'react';

export const StoreProvider: FC<ComponentProps<typeof Provider>> = ({
  children,
  ...props
}) => <Provider {...props}>{children}</Provider>;
