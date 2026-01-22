import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import env from '@/_config/env/server';

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(env.DATABASE_URL, { prepare: true });

export const db = drizzle(client);
