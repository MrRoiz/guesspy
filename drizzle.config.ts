import { defineConfig } from 'drizzle-kit';
import env from '@/_config/env/server';

export default defineConfig({
  out: './drizzle',
  schema: './app/_db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
