import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@/dictionaries';
import FuzzyText from '@/primitives/components/FuzzyText';
import { Button } from '@/primitives/components/ui/button';

const Page = async ({ params }: PageProps<'/[lang]/game'>) => {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  const otherLang = lang === 'en' ? 'es' : 'en';
  const langButtonText = lang === 'en' ? '¿Español?' : 'English?';

  return (
    <div className="relative flex flex-col gap-4">
      <Link href={`/${otherLang}/game`} className="fixed top-4 right-4 z-50">
        <Button variant="outline" size="sm">
          {langButtonText}
        </Button>
      </Link>
      <FuzzyText>Guesspy</FuzzyText>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-10">
        <Link className="w-full sm:w-auto" href={`/${lang}/game/local/setup`}>
          <Button className="w-full sm:w-auto">{dict.game.local}</Button>
        </Link>
        <Button disabled>{dict.game.room}</Button>
      </div>
    </div>
  );
};

export default Page;
