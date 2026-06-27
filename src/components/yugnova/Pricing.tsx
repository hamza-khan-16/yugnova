import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { supabase, type Plan } from "@/lib/supabase";
import { useSectionStyleImage } from "@/lib/useSectionStyleImage";

type PricingPlan = {
  id: string;
  title: string;
  desc: string;
  features: string[];
  price: string;
  period: string;
  popular: boolean;
};

const FALLBACK_PLANS: PricingPlan[] = [
  {
    id: "web",
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
    id: "mobile",
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
    id: "design",
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
    id: "support",
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

function toPricingPlan(p: Plan): PricingPlan {
  const formatted = new Intl.NumberFormat("en-IN").format(p.price);
  return {
    id: p.id,
    title: p.name,
    desc: p.description,
    features: p.features || [],
    price: `${p.currency}${formatted}`,
    period: p.period,
    popular: p.is_popular,
  };
}

export function Pricing() {
  const [plans, setPlans] = useState<PricingPlan[]>(FALLBACK_PLANS);
  const styleImage = useSectionStyleImage("pricing");

  useEffect(() => {
    supabase
      .from("plans")
      .select("*")
      .order("order_index")
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setPlans(data.map(toPricingPlan));
        }
      });
  }, []);

  return (
    <section id="pricing" className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 -z-10">
        <img
          src={styleImage ?? "/backgrounds/bg-pricing.jpeg"}
          alt=""
          className="h-full w-full object-cover object-center"
          style={{ imageRendering: "auto", filter: "none" }}
        />
        <div className="absolute inset-0 bg-[#0c0d13]/80" />
      </div>
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 md:px-12">
        <SectionLabel>Pricing</SectionLabel>
        <h2
          className="font-display mt-4 font-extrabold leading-[1.05] tracking-[-0.02em]"
          style={{ fontSize: "clamp(23px, 4.5vw, 46px)" }}
        >
          TRANSPARENT PRICING
        </h2>
        <p className="mt-4 max-w-md text-[15px] text-[color:var(--text-soft)]">
          Simple, honest pricing for every service. No surprises — just great work at a fair price.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              className={`relative flex min-w-0 flex-col rounded-2xl border bg-[color:var(--background)] p-7 transition-all hover:-translate-y-1 ${
                plan.popular
                  ? "border-[color:var(--primary)] shadow-[0_0_40px_-8px_var(--glow)]"
                  : "border-[color:var(--border-soft)] hover:border-[color:var(--border-strong)]"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[color:var(--primary)] px-3 py-0.5 font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-[color:var(--primary-foreground)]">
                  Most Popular
                </span>
              )}

              <h3 className="font-display text-[17px] font-bold break-words">{plan.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[color:var(--text-soft)] break-words">
                {plan.desc}
              </p>

              <div className="mt-6 flex flex-wrap items-baseline gap-1">
                <span className="font-display text-[32px] font-extrabold tracking-[-0.02em] break-words">
                  {plan.price}
                </span>
                <span className="font-mono text-[12px] text-[color:var(--text-dim)]">
                  {plan.period}
                </span>
              </div>

              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-[color:var(--foreground)]/85">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--primary)]" />
                    <span className="min-w-0 break-words">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-8 block rounded-xl py-2.5 text-center text-[13px] font-semibold transition-colors ${
                  plan.popular
                    ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:opacity-90"
                    : "border border-[color:var(--border-strong)] hover:bg-[color:var(--surface-2)]"
                }`}
              >
                Get Started →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}