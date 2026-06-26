import { motion } from "framer-motion";
import { SectionLabel } from "./SectionLabel";

const posts = [
  { title: "How to Build Scalable Web Applications", date: "May 20, 2026", color: "#1c1336" },
  { title: "UI/UX Design Trends in 2026", date: "May 12, 2026", color: "#14213a" },
  { title: "Why Cybersecurity Matters for Startups", date: "May 05, 2026", color: "#5b1530" },
];

export function Blog() {
  return (
    <section id="blog" className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 -z-10">
        <img src="/backgrounds/bg-blog.jpeg" alt="" className="h-full w-full object-cover object-center" style={{ imageRendering: "auto", filter: "none" }} />
        <div className="absolute inset-0 bg-[#0c0d13]/40" />
      </div>
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 md:px-12">
        <SectionLabel>Blog</SectionLabel>
        <h2 className="font-display mt-4 font-extrabold leading-[1.05] tracking-[-0.02em]"
          style={{ fontSize: "clamp(30px, 4.5vw, 46px)" }}>
          LATEST INSIGHTS
        </h2>
        <p className="mt-4 max-w-md text-[15px] text-[color:var(--text-soft)]">
          Thoughts, tips, and insights on technology, design, and business.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <motion.a
              href="#"
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl overflow-hidden border border-[color:var(--border-soft)] bg-[color:var(--surface)] hover:border-[color:var(--border-strong)] transition-colors"
            >
              <div className="aspect-[16/10]" style={{ background: `linear-gradient(135deg, ${p.color}, #0c0d13)` }} />
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
