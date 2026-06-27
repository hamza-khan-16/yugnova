import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdminSession } from "../adminSession.server";
import { getSupabaseAdmin } from "../supabaseAdmin.server";

// Folders inside the "media" bucket, kept separate so they're easy to
// browse/clean up from the Supabase dashboard.
const folderSchema = z.enum(["reel-posters", "reel-videos", "project-images", "blog-images"]);

function safeExtension(filename: string): string {
  const match = /\.[a-zA-Z0-9]+$/.exec(filename);
  return match ? match[0].toLowerCase() : "";
}

// Mints a one-time signed upload URL for a file the admin is about to
// upload from their device. The browser then uploads directly to Supabase
// Storage using this URL — the file never passes through our server
// function, so there's no Vercel request-body size limit to worry about
// (important for reel videos).
export const adminCreateUploadUrlFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      folder: folderSchema,
      filename: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();

    const ext = safeExtension(data.filename) || "";
    const path = `${data.folder}/${crypto.randomUUID()}${ext}`;

    const admin = getSupabaseAdmin();
    const { data: signed, error } = await admin.storage
      .from("media")
      .createSignedUploadUrl(path);

    if (error) throw new Error(error.message);

    const { data: pub } = admin.storage.from("media").getPublicUrl(path);

    return {
      path,
      token: signed.token,
      signedUrl: signed.signedUrl,
      publicUrl: pub.publicUrl,
    };
  });
