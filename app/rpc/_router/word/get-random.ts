import { os } from '@orpc/server';
import { isNull } from 'drizzle-orm';
import z from 'zod';
import { db } from '@/_db';
import { word } from '@/_db/schema';

export const getRandom = os
  .input(
    z.object({
      lang: z.enum(['es', 'en']),
    }),
  )
  .errors({
    INTERNAL_SERVER_ERROR: {},
  })
  .handler(async ({ input, errors }) => {
    const words = await db.select().from(word).where(isNull(word.deletedAt));
    const randomWord = words[Math.floor(Math.random() * words.length)];

    if (!randomWord) {
      // FIXME: This error should be intenationalized
      return errors.INTERNAL_SERVER_ERROR({
        message: 'Something went wront trying to get a word',
      });
    }

    const selectedWord = randomWord[input.lang];
    return selectedWord.charAt(0).toUpperCase() + selectedWord.slice(1);
  });
