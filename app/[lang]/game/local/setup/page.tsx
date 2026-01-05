import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@/dictionaries';
import { LocalUsersForm } from './_components/form';

const Page = async ({ params }: PageProps<'/[lang]/game/local/setup'>) => {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <div className="w-2/3">
      <LocalUsersForm dict={dict} lang={lang} />
    </div>
  );
};

export default Page;
