import { os } from '@orpc/server';
import { isNull } from 'drizzle-orm';
import { db } from '@/_db';
import { word } from '@/_db/schema';

export const getRandom = os.handler(async () => {
  const words = await db.select().from(word).where(isNull(word.deletedAt));

  return words[Math.floor(Math.random() * words.length)];
});
