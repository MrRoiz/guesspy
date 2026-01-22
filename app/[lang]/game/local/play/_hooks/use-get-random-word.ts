import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Locale } from '@/[lang]/dictionaries';
import orpc from '@/rpc/_client';

export const useGetRandomWord = (lang: Locale) => {
  const query = useQuery(orpc.word.getRandom.queryOptions({ input: { lang } }));
  const client = useQueryClient();

  return {
    query,
    invalidate: () =>
      client.invalidateQueries({
        queryKey: orpc.word.getRandom.key(),
      }),
  };
};
