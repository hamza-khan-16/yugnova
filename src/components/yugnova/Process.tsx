import { motion } from "framer-motion";
import { SectionLabel } from "./SectionLabel";

const steps = [
  { n: "01", title: "Discovery", desc: "Deep-dive into your goals, users, and constraints. We listen before we build." },
  { n: "02", title: "Design", desc: "Wireframes to high-fidelity prototypes. Every interaction is intentional." },
  { n: "03", title: "Develop", desc: "Clean, scalable code with performance and security at every layer." },
  { n: "04", title: "Launch & Scale", desc: "Deployment, monitoring, and ongoing support as your product grows." },
];

export function Process() {
  return (
    <section id="process" className="relative py-20 md:py-28 lg:py-32 bg-[color:var(--background)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 md:px-12">
        <div className="text-center max-w-2xl mx-auto">
          <SectionLabel center>How We Work</SectionLabel>
          <h2 className="font-display mt-5 sm:mt-6 font-extrabold leading-[1.05] tracking-[-0.03em]"
            style={{ fontSize: "clamp(22px, 4.5vw, 56px)" }}>
            Our proven <span className="gradient-text">process</span>
          </h2>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="mt-14 md:mt-20 relative">
          {/* Horizontal connector — desktop only */}
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, var(--primary), transparent)" }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-0">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative lg:text-center flex lg:flex-col items-start lg:items-center gap-5 lg:gap-0 lg:px-6"
              >
                {/* Vertical connector for mobile/tablet */}
                {i < steps.length - 1 && (
                  <div className="lg:hidden absolute left-[23px] top-[52px] w-px h-[calc(100%+8px)] sm:hidden"
                    style={{ background: "linear-gradient(180deg, var(--primary), transparent)" }} />
                )}

                <div className="relative shrink-0 h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 grid place-items-center rounded-full bg-[color:var(--surface)] border border-[color:var(--border-strong)] font-display text-lg sm:text-xl lg:text-2xl font-extrabold text-[color:var(--primary)] transition-all duration-500 group-hover:bg-[color:var(--primary)] group-hover:text-[color:var(--primary-foreground)] group-hover:scale-110 lg:mx-auto">
                  <span className="absolute -inset-1 rounded-full border border-dashed border-[color:var(--border-strong)] animate-spin-slow" />
                  {s.n}
                </div>

                <div className="lg:mt-6">
                  <h4 className="font-display text-base sm:text-lg font-bold">{s.title}</h4>
                  <p className="mt-1.5 sm:mt-2.5 text-[13px] sm:text-sm leading-[1.6] text-[color:var(--text-soft)] lg:max-w-[220px] lg:mx-auto">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
