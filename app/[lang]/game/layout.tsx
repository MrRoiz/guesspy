import type { FC, PropsWithChildren } from 'react';
import { StoreProvider } from '@/_providers/store';

const Layout: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex h-screen w-screen items-center justify-center">
    <StoreProvider>{children}</StoreProvider>
  </div>
);

export default Layout;
