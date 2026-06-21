// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Force-enable Nitro with the Vercel preset. Lovable's config only
  // auto-enables Nitro when building inside Lovable's own infra (it
  // defaults to a Cloudflare target there) — outside that context it skips
  // the plugin entirely, which breaks `vite build` on Vercel. This makes
  // the build work the same way locally and on Vercel.
  vite: {
    plugins: [
      nitro({
        preset: "vercel",
      }),
    ],
  },
});
