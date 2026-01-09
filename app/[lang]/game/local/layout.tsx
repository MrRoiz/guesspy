import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { getDictionary, hasLocale } from '@/dictionaries';
import { Button } from '@/primitives/components/ui/button';
import { StoreProvider } from '@/providers/store';

const Layout: FC<LayoutProps<'/[lang]/game/local'>> = async ({
  children,
  params,
}) => {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <>
      <Link href="/" className="absolute top-4 left-4">
        <Button variant="outline">{dict.app.backToHome}</Button>
      </Link>

      <StoreProvider>{children}</StoreProvider>
    </>
  );
};

export default Layout;
