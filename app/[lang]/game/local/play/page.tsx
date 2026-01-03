import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@/dictionaries';
import { Game } from './_components/game';

const Page = async ({ params }: PageProps<'/[lang]/game/local/play'>) => {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return <Game dict={dict} lang={params.lang} />;
};

export default Page;
