import { motion } from "framer-motion";
import { Code2, Smartphone, PenTool, Layers, ShieldCheck, Target } from "lucide-react";
import { SectionLabel } from "./SectionLabel";

const services = [
  { icon: Code2, title: "Web Development", desc: "High-performance websites built with the latest tech." },
  { icon: Smartphone, title: "Mobile App Development", desc: "Custom mobile apps for iOS and Android." },
  { icon: PenTool, title: "UI/UX Design", desc: "Beautiful, user-centered designs that convert." },
  { icon: Layers, title: "Software Development", desc: "Scalable software solutions tailored to your needs." },
  { icon: ShieldCheck, title: "Cybersecurity", desc: "Protect your business with advanced security." },
  { icon: Target, title: "Branding & Strategy", desc: "Build a strong brand that stands out." },
];

export function Services() {
  return (
    <section id="services" className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 -z-10">
        <img src="/backgrounds/bg-services.jpeg" alt="" className="h-full w-full object-cover object-center" style={{ imageRendering: "auto", filter: "none" }} />
        <div className="absolute inset-0 bg-[#13141d]/50" />
      </div>
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 md:px-12">
        <SectionLabel>Services</SectionLabel>
        <h2 className="font-display mt-4 font-extrabold leading-[1.05] tracking-[-0.02em]"
          style={{ fontSize: "clamp(23px, 4.5vw, 46px)" }}>
          WHAT WE DO
        </h2>
        <p className="mt-4 max-w-md text-[15px] text-[color:var(--text-soft)]">
          We provide end-to-end digital solutions that help your business grow in the modern world.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--background)] p-7 hover:border-[color:var(--border-strong)] hover:-translate-y-1 transition-all"
            >
              <div className="h-11 w-11 rounded-xl bg-[color:var(--surface-2)] grid place-items-center text-[color:var(--primary)]">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display mt-4 text-[17px] font-bold">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--text-soft)]">{s.desc}</p>
              <a href="#contact" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[color:var(--primary)]">
                Learn more →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
