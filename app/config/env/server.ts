import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
  },
  experimental__runtimeEnv: process.env,
});

export default env;
