// Supabase client — cloud features are OPT-IN by configuration. Without
// VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY the app runs exactly as the
// local-only build: no client is created, sync UI explains itself, the
// league stays simulated. See supabase/schema.sql for the backend setup.

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const cloudEnabled = Boolean(url && anonKey);

export const supabase = cloudEnabled ? createClient(url, anonKey) : null;
