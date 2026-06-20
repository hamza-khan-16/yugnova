import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase, type Plan } from "@/lib/supabase";

type Service = {
  id: string;
  num: string;
  title: string;
  desc: string;
  features: string[];
  price: string;
  period: string;
  popular: boolean;
};

const FALLBACK_SERVICES: Service[] = [
  {
    id: "web", num: "01",
    title: "Web Development",
    desc: "Modern, high-performance websites and applications engineered for speed, scalability, and conversion.",
    features: [
      "Business Websites & Landing Pages",
      "Custom Web Applications",
      "E-Commerce Solutions",
      "Progressive Web Apps",
      "CMS Integration",
    ],
    price: "₹49,999",
    period: "/project",
    popular: false,
  },
  {
    id: "mobile", num: "02",
    title: "Mobile Applications",
    desc: "Native and cross-platform mobile experiences that users love — from iOS and Android to Flutter and React Native.",
    features: [
      "iOS & Android Native Apps",
      "Cross-Platform Development",
      "App Store Deployment",
      "Push Notifications & Analytics",
      "Offline-First Architecture",
    ],
    price: "₹89,999",
    period: "/project",
    popular: true,
  },
  {
    id: "design", num: "03",
    title: "UI / UX Design",
    desc: "User-centered design that balances aesthetics with functionality for exceptional digital experiences.",
    features: [
      "User Research & Personas",
      "Wireframing & Prototyping",
      "Visual Design Systems",
      "Interaction Design",
      "Usability Testing",
    ],
    price: "₹39,999",
    period: "/project",
    popular: false,
  },
  {
    id: "support", num: "04",
    title: "Maintenance & Support",
    desc: "Ongoing technical care to keep your digital presence secure, fast, and current.",
    features: [
      "Security Updates & Patches",
      "Performance Monitoring",
      "Content Updates",
      "Feature Enhancements",
      "Monthly Reporting",
    ],
    price: "₹14,999",
    period: "/month",
    popular: false,
  },
];

function toService(p: Plan, index: number): Service {
  const formatted = new Intl.NumberFormat("en-IN").format(p.price);
  return {
    id: p.id,
    num: String(index + 1).padStart(2, "0"),
    title: p.name,
    desc: p.description,
    features: p.features || [],
    price: `${p.currency}${formatted}`,
    period: p.period,
    popular: p.is_popular,
  };
}

export function Services() {
  const [services, setServices] = useState<Service[]>(FALLBACK_SERVICES);

  useEffect(() => {
    supabase
      .from("plans")
      .select("*")
      .order("order_index")
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setServices(data.map(toService));
        }
      });
  }, []);

  return (
    <section id="services" className="relative bg-[color:var(--surface)] pt-20 md:pt-28 lg:pt-32 pb-12">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="text-center max-w-4xl mx-auto">
          <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[color:var(--text-dim)]">
            01 / {String(services.length).padStart(2, "0")} · Services
          </div>
          <h2 className="font-display mt-5 text-[clamp(32px,6vw,84px)] font-extrabold leading-[1] tracking-[-0.035em]">
            Comprehensive <span className="gradient-text">Digital</span> Solutions
          </h2>
          <p className="mt-6 text-[14px] md:text-[15px] text-[color:var(--text-soft)] max-w-xl mx-auto leading-[1.6]">
            From elegant web experiences to rigorous security assessments — every service delivered with precision.
          </p>
        </div>

        {/* Sticky stacked cards */}
        <div className="mt-14 md:mt-20 relative">
          {services.map((s, i) => (
            <div
              key={s.id}
              className="sticky"
              style={{ top: `${80 + i * 22}px`, marginBottom: `22px`, zIndex: 10 + i }}
            >
              <ServiceCard data={s} index={i} />
            </div>
          ))}
        </div>
      </div>
      <div className="h-[15vh] md:h-[20vh]" />
    </section>
  );
}

function ServiceCard({ data, index }: { data: Service; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      className="relative overflow-hidden rounded-[20px] md:rounded-[28px] border border-[color:var(--border-strong)] bg-[color:var(--background)] backdrop-blur-xl"
      style={{ boxShadow: "0 30px 60px -30px rgba(0,0,0,0.45), 0 0 0 1px var(--border-soft) inset" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(1200px 400px at 90% -10%, rgba(0,71,171,0.10), transparent 60%)" }} />

      <div className="relative p-6 md:p-10 lg:p-14">
        {/* Top row: number + title */}
        <div className="flex items-start gap-4 mb-5">
          <span className="inline-block font-mono text-[11px] tracking-[0.15em] font-bold bg-[color:var(--foreground)] text-[color:var(--background)] px-2 py-1 rounded shrink-0 mt-1">
            {data.num}
          </span>
          <h3 className="font-display text-[24px] sm:text-[30px] md:text-[40px] lg:text-[44px] leading-[1.05] font-extrabold tracking-[-0.025em]">
            {data.title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-6">
          {/* Desc */}
          <div className="md:col-span-5">
            <p className="text-[14px] md:text-[15px] leading-[1.65] text-[color:var(--text-soft)]">
              {data.desc}
            </p>
          </div>

          {/* Features */}
          <ul className="md:col-span-4 space-y-2.5">
            {data.features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-[13px] md:text-[14px] text-[color:var(--foreground)]/85 border-b border-dashed border-[color:var(--border-soft)] pb-2">
                <span className="text-[color:var(--primary)] shrink-0">→</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {/* Price */}
          <div className="md:col-span-3 md:text-right">
            <div className="font-display text-[28px] sm:text-[32px] md:text-[38px] font-extrabold tracking-[-0.02em]">
              {data.price}
            </div>
            <div className="font-mono text-[12px] md:text-[13px] text-[color:var(--text-dim)]">
              {data.period}
            </div>
            {data.popular && (
              <span className="inline-block mt-2 text-[10px] font-bold tracking-[0.15em] bg-red-600 text-white px-2 py-1 rounded">
                MOST POPULAR
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
