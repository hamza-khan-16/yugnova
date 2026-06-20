import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client. Uses the SERVICE ROLE key, which bypasses
// Row Level Security — this file must never be imported from client code.
// The .server.ts suffix keeps it out of the browser bundle.
//
// Required env vars (set these WITHOUT the VITE_ prefix so they never
// ship to the browser):
//   SUPABASE_URL              - same value as VITE_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY - service_role key from Supabase project settings

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Server misconfigured: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set " +
        "as server-side environment variables (no VITE_ prefix on the service key).",
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
