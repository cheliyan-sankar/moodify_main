import { createClient } from '@supabase/supabase-js';

// In Next.js, server and client bundles can see different env vars.
// Prefer NEXT_PUBLIC_* for browser usage, but allow SUPABASE_* as a fallback
// (useful on server routes / Vercel env setup).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

let supabaseClient: any;

if (!supabaseUrl || !supabaseAnonKey) {
  const missing: string[] = [];
  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)');
  if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_ANON_KEY)');

  console.warn(
    `Supabase environment variables are not set (${missing.join(', ')}). ` +
      'Exporting a noop client; Supabase-backed content will not load.'
  );

  const makeBuilder = () => {
    const builder: any = {
      select() { return builder; },
      order() { return builder; },
      eq() { return builder; },
      gte() { return builder; },
      lt() { return builder; },
      limit() { return builder; },
      insert() { return builder; },
      update() { return builder; },
      delete() { return builder; },
      then(resolve: any) {
        const res = { data: null, error: null };
        resolve(res);
        return Promise.resolve(res);
      },
      catch() { return Promise.resolve({ data: null, error: null }); },
    };
    return builder;
  };

  supabaseClient = {
    from() { return makeBuilder(); },
    rpc() { return makeBuilder(); },
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      // Provide a compatible onAuthStateChange that returns a subscription
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        const subscription = {
          unsubscribe: () => {},
        };
        // no-op: don't call callback because there's no session
        return { data: { subscription } };
      },
      // minimal sign in/out shapes matching supabase-js v2
      signInWithPassword: async (_: any) => ({ data: null, error: null }),
      signUp: async (_: any) => ({ data: null, error: null }),
      signOut: async () => ({ data: null, error: null }),
    },
  };
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient;
