import type { FC, PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex h-screen w-screen items-center justify-center">
    {children}
  </div>
);

export default Layout;
