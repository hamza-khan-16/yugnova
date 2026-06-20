import { useSession } from "@tanstack/react-start/server";

type AdminSessionData = {
  admin: boolean;
};

// Sealed, httpOnly, signed+encrypted cookie session (TanStack Start's
// built-in session helper). The cookie only ever holds `{ admin: true }` —
// it carries no credentials and can't be forged or read client-side.
export function getAdminSession() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "Server misconfigured: set ADMIN_SESSION_SECRET to a random string of at least " +
        "32 characters (e.g. `openssl rand -hex 32`) as a server-side env var.",
    );
  }

  return useSession<AdminSessionData>({
    password: secret,
    name: "admin_session",
    maxAge: 60 * 60 * 8, // 8 hours
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    },
  });
}

export function checkAdminCredentials(username: string, password: string): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    throw new Error(
      "Server misconfigured: set ADMIN_USERNAME and ADMIN_PASSWORD as server-side " +
        "env vars (no VITE_ prefix, no fallback/default — choose a real password).",
    );
  }

  return username === expectedUsername && password === expectedPassword;
}

// Throws if the current request doesn't have a valid admin session.
// Every privileged server function calls this before touching the database.
export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session.data.admin) {
    throw new Error("Not authenticated.");
  }
}
