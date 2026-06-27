import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ThemeProvider } from "@/components/yugnova/ThemeProvider";
import { Navbar } from "@/components/yugnova/Navbar";
import { Footer } from "@/components/yugnova/Footer";
import { supabase, type Blog } from "@/lib/supabase";

export const Route = createFileRoute("/blog/$blogId")({
  head: () => ({
    meta: [{ title: "Blog — YUGNOVA" }],
  }),
  component: BlogPostPage,
});

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
}

// Renders the "Main Body / Content" textarea written in the admin panel:
// blank line = new paragraph, a line starting with "## " = subheading,
// consecutive lines starting with "- " = a bullet list.
function BlogContent({ content }: { content: string }) {
  const blocks = content.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        const isHeading = lines.length === 1 && lines[0].startsWith("## ");
        const isList = lines.length > 0 && lines.every((l) => l.startsWith("- "));

        if (isHeading) {
          return (
            <h3 key={i} className="font-display text-[22px] sm:text-[26px] font-bold leading-snug mt-10">
              {lines[0].replace(/^##\s*/, "")}
            </h3>
          );
        }

        if (isList) {
          return (
            <ul key={i} className="list-disc pl-5 space-y-2 text-[15.5px] leading-[1.8] text-[color:var(--text-soft)]">
              {lines.map((l, j) => (
                <li key={j}>{l.replace(/^-\s*/, "")}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="text-[15.5px] leading-[1.8] text-[color:var(--text-soft)]">
            {lines.join(" ")}
          </p>
        );
      })}
    </div>
  );
}

function BlogPostPage() {
  const { blogId } = useParams({ from: "/blog/$blogId" });
  const [post, setPost] = useState<Blog | null>(null);
  const [status, setStatus] = useState<"loading" | "found" | "not-found">("loading");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    supabase
      .from("blogs")
      .select("*")
      .eq("id", blogId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error || !data) {
          setStatus("not-found");
        } else {
          setPost(data as Blog);
          setStatus("found");
          if (typeof document !== "undefined") document.title = `${data.title} — YUGNOVA`;
        }
      });
    return () => {
      active = false;
    };
  }, [blogId]);

  return (
    <ThemeProvider>
      <Navbar />
      <main className="min-h-screen bg-[color:var(--background)]">
        {status === "loading" && (
          <div className="flex items-center justify-center py-32">
            <div className="w-6 h-6 rounded-full border-2 border-[color:var(--primary)] border-t-transparent animate-spin" />
          </div>
        )}

        {status === "not-found" && (
          <div className="max-w-md mx-auto text-center py-32 px-5">
            <h1 className="font-display text-2xl font-bold">Post not found</h1>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              This blog post doesn't exist or may have been removed.
            </p>
            <a
              href="/#blog"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--primary)]"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </a>
          </div>
        )}

        {status === "found" && post && (
          <article className="pt-28 md:pt-32 pb-20 md:pb-28">
            <div className="mx-auto max-w-[760px] px-5 sm:px-8">
              <a
                href="/#blog"
                className="inline-flex items-center gap-2 text-[13px] font-mono text-[color:var(--text-dim)] hover:text-[color:var(--primary)] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
              </a>

              <div className="mt-6 flex items-center gap-3 flex-wrap">
                {post.category && (
                  <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-[color:var(--primary)] border border-[color:var(--border-soft)] px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                )}
                <span className="font-mono text-[12px] text-[color:var(--text-dim)]">{formatDate(post.published_at)}</span>
                {post.read_time && <span className="font-mono text-[12px] text-[color:var(--text-dim)]">· {post.read_time}</span>}
              </div>

              <h1 className="font-display mt-4 font-extrabold leading-[1.1] tracking-[-0.02em]" style={{ fontSize: "clamp(28px, 5vw, 48px)" }}>
                {post.title}
              </h1>

              {post.subtitle && (
                <p className="mt-4 text-[17px] sm:text-[19px] text-[color:var(--text-soft)] leading-relaxed">
                  {post.subtitle}
                </p>
              )}

              <div className="mt-6 flex items-center gap-3">
                {post.author_image ? (
                  <img src={post.author_image} alt={post.author} className="w-9 h-9 rounded-full object-cover border border-[color:var(--border-soft)]" />
                ) : (
                  <div className="w-9 h-9 rounded-full grid place-items-center text-xs font-bold border border-[color:var(--border-soft)] bg-[color:var(--surface)]">
                    {post.author?.[0]?.toUpperCase() ?? "A"}
                  </div>
                )}
                <span className="text-sm font-semibold">{post.author}</span>
              </div>

              {post.cover_image && (
                <div className="mt-8 rounded-2xl overflow-hidden border border-[color:var(--border-soft)] aspect-[16/9]">
                  <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="mt-10">
                <BlogContent content={post.content} />
              </div>

              {post.tags?.length > 0 && (
                <div className="mt-12 flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span key={t} className="font-mono text-[11px] text-[color:var(--text-dim)] bg-[color:var(--surface)] border border-[color:var(--border-soft)] px-2.5 py-1 rounded-full">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        )}
      </main>
      <Footer />
    </ThemeProvider>
  );
}
