import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SectionLabel } from "./SectionLabel";

const stats = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 30, suffix: "+", label: "Happy Clients" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 3, suffix: "+", label: "Years of Excellence" },
];

const timeline = [
  { title: "Founded with a vision", desc: "YUGNOVA was born from a desire to build technology that's not just functional — but extraordinary." },
  { title: "AI-first approach", desc: "Every product we build is engineered with intelligence at its core, leveraging the latest in machine learning and automation." },
  { title: "Global reach, local roots", desc: "Based in India, serving clients worldwide. Remote-first since day one." },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1600, start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.floor(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

export function About() {
  return (
    <section id="about" className="relative py-20 md:py-28 lg:py-32 bg-[color:var(--background)]">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            <SectionLabel>About YUGNOVA</SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(32px,5vw,72px)] font-extrabold leading-[1] tracking-[-0.03em]">
              We are the <span className="gradient-text">builders</span> of tomorrow
            </h2>
            <p className="mt-6 text-[15px] md:text-lg leading-[1.7] text-[color:var(--text-soft)]">
              YUGNOVA is a premium technology studio specializing in AI solutions, cutting-edge web development, mobile applications, and digital innovation. Founded with care, we bring enterprise-grade quality to ambitious startups and growing brands.
            </p>
            <div className="mt-8 md:mt-10 space-y-6 md:space-y-7">
              {timeline.map((t, i) => (
                <motion.div key={t.title}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex gap-4 md:gap-5"
                >
                  <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[color:var(--primary)]"
                    style={{ boxShadow: "0 0 12px var(--glow)" }} />
                  <div>
                    <h4 className="font-display text-[15px] md:text-base font-bold">{t.title}</h4>
                    <p className="mt-1 text-[13px] md:text-sm leading-[1.6] text-[color:var(--text-soft)]">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-2xl md:rounded-3xl bg-[color:var(--surface)] border border-[color:var(--border-strong)] p-6 md:p-10 overflow-hidden backdrop-blur-xl">
              <div className="absolute inset-0 rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(0,71,171,0.07), rgba(0,45,114,0.03))" }} />
              <div className="relative grid grid-cols-2 gap-3 md:gap-5">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-xl md:rounded-2xl bg-[color:var(--surface-2)] border border-[color:var(--border-soft)] p-5 md:p-7 text-center hover:border-[color:var(--primary)] hover:-translate-y-1 transition-all">
                    <div className="font-display text-[36px] md:text-5xl font-extrabold tracking-[-0.04em] gradient-text">
                      <Counter to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="mt-1.5 md:mt-2 font-mono text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-[color:var(--text-dim)]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
