import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdminSession } from "../adminSession.server";
import { getSupabaseAdmin } from "../supabaseAdmin.server";

const reelInput = z.object({
  name: z.string().min(1),
  role: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string(),
  poster: z.string(),
  video: z.string(),
  likes: z.string(),
  order_index: z.number(),
});

const projectInput = z.object({
  title: z.string().min(1),
  category: z.string(),
  tags: z.array(z.string()),
  description: z.string(),
  image: z.string(),
  link: z.string(),
  order_index: z.number(),
});

const planInput = z.object({
  name: z.string().min(1),
  price: z.number(),
  currency: z.string(),
  period: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  is_popular: z.boolean(),
  order_index: z.number(),
});

const blogInput = z.object({
  title: z.string().min(1),
  excerpt: z.string(),
  content: z.string(),
  cover_image: z.string(),
  author: z.string(),
  published_at: z.string(),
  order_index: z.number(),
});

const schemas = {
  reels: reelInput,
  projects: projectInput,
  plans: planInput,
  blogs: blogInput,
} as const;

type TableName = keyof typeof schemas;
const tableNameSchema = z.enum(["reels", "projects", "plans", "blogs"]);

export const adminSaveRowFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      table: tableNameSchema,
      id: z.string().optional(), // present => update, absent => insert
      payload: z.record(z.string(), z.unknown()),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();

    const table: TableName = data.table;
    const schema = schemas[table];
    const parsed = schema.parse(data.payload); // throws -> rejected on bad shape

    const admin = getSupabaseAdmin();
    if (data.id) {
      const { error } = await admin.from(table).update(parsed as never).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await admin.from(table).insert(parsed as never);
      if (error) throw new Error(error.message);
    }

    return { ok: true as const };
  });

export const adminDeleteRowFn = createServerFn({ method: "POST" })
  .validator(z.object({ table: tableNameSchema, id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdminSession();

    const admin = getSupabaseAdmin();
    const { error } = await admin.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);

    return { ok: true as const };
  });
