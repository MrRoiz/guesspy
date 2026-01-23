import { createClient } from '@supabase/supabase-js';
import env from '@/env/client';

export const supabase = () =>
  createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY,
  );
