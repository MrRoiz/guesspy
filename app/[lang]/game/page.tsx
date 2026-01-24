import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GithubStarsCounter } from '@/components/github-stars-counter';
import { getDictionary, hasLocale } from '@/dictionaries';
import FuzzyText from '@/primitives/components/FuzzyText';
import { Button } from '@/primitives/components/ui/button';

const Page = async ({ params }: PageProps<'/[lang]/game'>) => {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  const otherLang = lang === 'en' ? 'es' : 'en';
  const langButtonText = lang === 'en' ? '¿Español?' : 'English?';

  return (
    <>
      <Link href={`/${otherLang}/game`} className="absolute top-4 right-4 z-50">
        <Button variant="outline" size="sm">
          {langButtonText}
        </Button>
      </Link>
      <GithubStarsCounter
        className="absolute top-4 left-4"
        label={dict.app.githubStars}
      />
      <div className="flex flex-col gap-4">
        <FuzzyText glitchMode fontSize="clamp(3rem, 8vw, 7rem)">
          Guesspy
        </FuzzyText>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-10">
          <Link className="w-full sm:w-auto" href={`/${lang}/game/local/setup`}>
            <Button className="w-full sm:w-auto">{dict.game.local}</Button>
          </Link>
          <Link className="w-full sm:w-auto" href={`/${lang}/game/room`}>
            <Button className="w-full sm:w-auto">{dict.game.room}</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Page;
