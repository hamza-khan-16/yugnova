import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "./SectionLabel";
import { supabase, type Blog as DbBlog } from "@/lib/supabase";
import { useSectionStyleImage } from "@/lib/useSectionStyleImage";

type Post = {
  id: string;
  title: string;
  date: string;
  color: string;
  image?: string;
};

const FALLBACK_POSTS: Post[] = [
  { id: "p1", title: "How to Build Scalable Web Applications", date: "May 20, 2026", color: "#1c1336" },
  { id: "p2", title: "UI/UX Design Trends in 2026", date: "May 12, 2026", color: "#14213a" },
  { id: "p3", title: "Why Cybersecurity Matters for Startups", date: "May 05, 2026", color: "#5b1530" },
];

const GRADIENT_COLORS = ["#1c1336", "#14213a", "#5b1530", "#16312b", "#3a1c14"];

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
}

function toPost(b: DbBlog, i: number): Post {
  return {
    id: b.id,
    title: b.title,
    date: formatDate(b.published_at),
    color: GRADIENT_COLORS[i % GRADIENT_COLORS.length],
    image: b.cover_image || undefined,
  };
}

export function Blog() {
  const [posts, setPosts] = useState<Post[]>(FALLBACK_POSTS);
  const styleImage = useSectionStyleImage("blog");

  useEffect(() => {
    supabase
      .from("blogs")
      .select("*")
      .order("order_index")
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setPosts(data.map(toPost));
        }
      });
  }, []);

  return (
    <section id="blog" className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 -z-10">
        <img src={styleImage ?? "/backgrounds/bg-blog.jpeg"} alt="" className="h-full w-full object-cover object-center" style={{ imageRendering: "auto", filter: "none" }} />
        <div className="absolute inset-0 bg-[#0c0d13]/40" />
      </div>
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 md:px-12">
        <SectionLabel>Blog</SectionLabel>
        <h2 className="font-display mt-4 font-extrabold leading-[1.05] tracking-[-0.02em]"
          style={{ fontSize: "clamp(23px, 4.5vw, 46px)" }}>
          LATEST INSIGHTS
        </h2>
        <p className="mt-4 max-w-md text-[15px] text-[color:var(--text-soft)]">
          Thoughts, tips, and insights on technology, design, and business.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <motion.a
              href="#"
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl overflow-hidden border border-[color:var(--border-soft)] bg-[color:var(--surface)] hover:border-[color:var(--border-strong)] transition-colors"
            >
              <div
                className="aspect-[16/10]"
                style={
                  p.image
                    ? { backgroundImage: `url(${p.image})`, backgroundSize: "cover", backgroundPosition: "center" }
                    : { background: `linear-gradient(135deg, ${p.color}, #0c0d13)` }
                }
              />
              <div className="p-6">
                <h4 className="font-display text-[16.5px] font-bold leading-snug">{p.title}</h4>
                <div className="mt-3 font-mono text-[12px] text-[color:var(--text-dim)]">{p.date} · By Admin</div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
