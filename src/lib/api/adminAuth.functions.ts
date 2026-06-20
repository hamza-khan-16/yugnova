import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { checkAdminCredentials, getAdminSession } from "../adminSession.server";

export const adminLoginFn = createServerFn({ method: "POST" })
  .validator(z.object({ username: z.string().min(1), password: z.string().min(1) }))
  .handler(async ({ data }) => {
    // Constant-ish delay so login timing doesn't leak whether the
    // username/password matched.
    await new Promise((r) => setTimeout(r, 300));

    const ok = checkAdminCredentials(data.username, data.password);
    if (!ok) {
      return { ok: false as const };
    }

    const session = await getAdminSession();
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminLogoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getAdminSession();
  await session.clear();
  return { ok: true as const };
});

export const adminCheckSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  return { authed: session.data.admin === true };
});
