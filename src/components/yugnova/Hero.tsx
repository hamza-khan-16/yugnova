import { motion } from "framer-motion";
import { useSectionStyleImage } from "@/lib/useSectionStyleImage";

const stats = [
  { value: "50+", label: "Projects Completed" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+", label: "Years of Experience" },
];

const brands = ["Google", "Microsoft", "AWS", "Airbnb", "Stripe"];

export function Hero() {
  const styleImage = useSectionStyleImage("hero");

  return (
    <section id="home" className="relative overflow-hidden pt-28 sm:pt-32 pb-16 md:pb-24">
      <div className="absolute inset-0 -z-10">
        <img src={styleImage ?? "/backgrounds/bg-home.jpeg"} alt="" className="h-full w-full object-cover object-center" style={{ imageRendering: "auto", filter: "none" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0d13]/10 via-[#0c0d13]/25 to-[#0c0d13]/70" />
      </div>
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 md:px-12">
        <div className="grid gap-12 lg:gap-14 items-center max-w-3xl mx-auto">

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--primary)] font-semibold">
              <span className="h-[7px] w-[7px] rounded-full bg-[color:var(--primary)]" style={{ boxShadow: "0 0 10px var(--glow)" }} />
              Blog
            </div>

            <h1 className="font-display mt-4 font-extrabold leading-[1.02] tracking-[-0.02em]"
              style={{ fontSize: "clamp(26px, 5.4vw, 58px)" }}>
              WE BUILD DIGITAL PRODUCTS THAT{" "}
              <span className="text-[color:var(--primary)]">DRIVE GROWTH</span>
            </h1>

            <p className="mt-5 max-w-md text-[15px] sm:text-base leading-relaxed text-[color:var(--text-soft)]">
              We help startups and businesses build modern websites, mobile apps, and software solutions focused on quality, performance, and security.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#contact"
                className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-bold text-[14px] px-6 py-3.5 hover:-translate-y-0.5 transition-all">
                Start Your Project ↗
              </a>
              <a href="#services"
                className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border-strong)] font-bold text-[14px] px-6 py-3.5 hover:border-[color:var(--foreground)] hover:-translate-y-0.5 transition-all">
                Explore Services ↗
              </a>
            </div>

            {/* Trust strip */}
            <div className="mt-10 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-6 py-5">
              <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-[color:var(--text-dim)]">
                Trusted by companies worldwide
              </div>
              <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 font-display font-semibold text-[15px] text-[color:var(--text-soft)] opacity-90">
                {brands.map((b) => <span key={b}>{b}</span>)}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-4 py-4 text-center">
                  <div className="font-display text-[26px] sm:text-[30px] font-extrabold text-[color:var(--primary)]">{s.value}</div>
                  <div className="mt-1 font-mono text-[9px] tracking-[0.1em] uppercase text-[color:var(--text-dim)] leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
