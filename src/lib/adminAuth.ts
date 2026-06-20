// Thin client wrapper around the server-side admin session. Credentials
// are checked on the server (src/lib/adminSession.server.ts) against
// server-only env vars; the browser never sees the password and never
// decides whether a session is valid — it just relays the signed,
// httpOnly cookie that the server manages.

import {
  adminCheckSessionFn,
  adminLoginFn,
  adminLogoutFn,
} from "@/lib/api/adminAuth.functions";

export async function adminLogin(username: string, password: string): Promise<boolean> {
  const result = await adminLoginFn({ data: { username, password } });
  return result.ok;
}

export async function adminLogout(): Promise<void> {
  await adminLogoutFn();
}

export async function isAdminLoggedIn(): Promise<boolean> {
  try {
    const result = await adminCheckSessionFn();
    return result.authed;
  } catch {
    return false;
  }
}
