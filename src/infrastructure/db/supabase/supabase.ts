import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl) throw new Error('Error extracting env variables');
if (!supabaseKey) throw new Error('Error extracting env variables');
if (!supabaseServiceKey) throw new Error('Error extracting env variables');

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
