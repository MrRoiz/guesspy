import { defineConfig } from 'drizzle-kit';
import env from '@/env/server';

export default defineConfig({
  out: './drizzle',
  schema: './app/_db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
