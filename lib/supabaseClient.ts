import { createClient } from '@supabase/supabase-js';

// এটি ব্রাউজারে ব্যবহারের জন্য (পাবলিক কী)
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);