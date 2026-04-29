import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL must be declared in .env');
if (!supabaseKey)
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY must be declared in .env'
  );
if (!supabaseServiceKey)
  throw new Error('SUPABASE_SERVICE_ROLE_KEY must be declared in .env');

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
