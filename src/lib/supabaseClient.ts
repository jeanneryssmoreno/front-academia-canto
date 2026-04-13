import { createClient } from '@supabase/supabase-js'

const env = import.meta.env as Record<string, string | undefined>
const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseAnonKey = env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		'Missing Supabase env vars. Configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY (or VITE_SUPABASE_ANON_KEY) in Vercel.'
	)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
