import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { getDictionary, hasLocale } from '@/dictionaries';
import { Lobby } from './_components/lobby';

const Page: FC<PageProps<'/[lang]/game/room/[roomId]'>> = async ({
  params,
}) => {
  const { lang, roomId } = await params;
  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return <Lobby dict={dict} lang={lang} roomId={roomId} />;
};

export default Page;
