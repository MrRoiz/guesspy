import type { FC, PropsWithChildren } from 'react';
import { StoreProvider } from '@/providers/store';

const Layout: FC<PropsWithChildren> = ({ children }) => (
  <StoreProvider>{children}</StoreProvider>
);

export default Layout;
