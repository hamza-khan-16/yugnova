import { motion } from "framer-motion";
import { CheckCircle2, Clock, Heart, DollarSign, Cpu, RotateCcw } from "lucide-react";
import { SectionLabel } from "./SectionLabel";

const stats = [
  { value: "50+", label: "Projects Completed" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+", label: "Years of Experience" },
];

const values = [
  { icon: CheckCircle2, title: "Quality & Performance", desc: "We never compromise on quality." },
  { icon: Clock, title: "On-Time Delivery", desc: "We respect your time and deadlines." },
  { icon: Heart, title: "Client-Centric Approach", desc: "Your success is our priority." },
  { icon: DollarSign, title: "Affordable Pricing", desc: "High quality without breaking the bank." },
  { icon: Cpu, title: "Modern Technologies", desc: "We use the latest tools and frameworks." },
  { icon: RotateCcw, title: "Ongoing Support", desc: "We're with you, even after delivery." },
];

export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 -z-10">
        <img src="/backgrounds/bg-about.jpeg" alt="" className="h-full w-full object-cover object-center" style={{ imageRendering: "auto", filter: "none" }} />
        <div className="absolute inset-0 bg-[#0c0d13]/70" />
      </div>
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 md:px-12">
        <div className="grid gap-14 items-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <SectionLabel>About Us</SectionLabel>
            <h2 className="font-display mt-4 font-extrabold leading-[1.05] tracking-[-0.02em]"
              style={{ fontSize: "clamp(23px, 4.5vw, 46px)" }}>
              WE ARE <span className="text-[color:var(--primary)]">YUGNOVA</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[color:var(--text-soft)]">
              We are a team of passionate developers, designers, and problem-solvers dedicated to building digital products that make a difference.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-4 py-4 text-center">
                  <div className="font-display text-[24px] font-extrabold text-[color:var(--primary)]">{s.value}</div>
                  <div className="mt-1 font-mono text-[8.5px] tracking-[0.1em] uppercase text-[color:var(--text-dim)] leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Values */}
        <div>
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[color:var(--text-dim)] mb-6">Our Values</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-[color:var(--surface-2)] grid place-items-center text-[color:var(--primary)]">
                  <v.icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h5 className="font-display text-[15px] font-bold">{v.title}</h5>
                  <p className="mt-1 text-[13.5px] text-[color:var(--text-soft)]">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
