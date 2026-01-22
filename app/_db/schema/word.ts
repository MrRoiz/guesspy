import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const word = pgTable('Word', {
  id: text().primaryKey().default('gen_random_uuid()'),
  es: text().notNull(),
  en: text().notNull(),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  deletedAt: timestamp({ mode: 'date' }),
});
