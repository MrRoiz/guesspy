import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const word = pgTable('word', {
  id: varchar().primaryKey().default('gen_random_uuid()'),
  es: varchar().notNull(),
  en: varchar().notNull(),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  deletedAt: timestamp({ mode: 'date' }),
});
