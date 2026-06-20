import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const socials = ["TW", "LI", "GH", "IG", "DR"];

  const cols = [
    { title: "Services", items: ["AI Solutions", "Web Development", "Mobile Apps", "UI/UX Design", "Cybersecurity", "Cloud & DevOps"] },
    { title: "Company", items: ["About", "Work", "Process", "Careers", "Contact"] },
    { title: "Resources", items: ["Blog", "Case Studies", "Newsletter", "Privacy", "Terms"] },
  ];

  return (
    <footer className="relative bg-[color:var(--background)] border-t border-[color:var(--border-soft)] pt-14 md:pt-20 pb-10 overflow-hidden">
      <span aria-hidden className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-8 font-display font-extrabold tracking-[-0.05em] whitespace-nowrap select-none"
        style={{ fontSize: "clamp(60px, 18vw, 220px)", color: "var(--foreground)", opacity: 0.025 }}>
        YUGNOVA
      </span>

      <div className="relative mx-auto max-w-[1280px] px-6 md:px-12">
        {/* Main grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12 md:mb-16">
          {/* Brand col */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <a href="#home" className="font-display text-[24px] md:text-[28px] font-extrabold tracking-[-0.03em]">
              YUG<span className="gradient-text">NOVA</span>
            </a>
            <p className="mt-4 max-w-[320px] text-[14px] md:text-[15px] leading-[1.7] text-[color:var(--text-soft)]">
              A premium technology studio engineering category-defining software for ambitious teams worldwide.
            </p>
            <div className="mt-6 flex gap-2 md:gap-3 flex-wrap">
              {socials.map((s) => (
                <a key={s} href="#"
                  className="h-9 w-9 md:h-10 md:w-10 grid place-items-center rounded-[10px] bg-[color:var(--surface-2)] border border-[color:var(--border-soft)] font-mono text-[10px] md:text-[11px] font-bold text-[color:var(--text-soft)] hover:bg-[color:var(--primary)] hover:text-white hover:border-[color:var(--primary)] hover:-translate-y-0.5 transition-all">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {cols.map((c) => (
            <div key={c.title}>
              <h5 className="font-display text-sm font-bold tracking-[-0.01em]">{c.title}</h5>
              <ul className="mt-4 md:mt-5 space-y-2.5 md:space-y-3">
                {c.items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[13px] md:text-sm text-[color:var(--text-dim)] hover:text-[color:var(--primary)] transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 md:pt-8 border-t border-[color:var(--border-soft)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.08em] text-[color:var(--text-dim)]">
            © {new Date().getFullYear()} YUGNOVA. All rights reserved.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); if (!email) return; toast.success("Subscribed."); setEmail(""); }}
            className="flex w-full sm:w-auto"
          >
            <input
              value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com"
              className="bg-[color:var(--surface)] border border-[color:var(--border-strong)] border-r-0 rounded-l-full px-4 md:px-5 py-2.5 text-[12px] md:text-[13px] flex-1 sm:w-[200px] md:w-[220px] outline-none focus:border-[color:var(--primary)] placeholder:text-[color:var(--text-dim)]"
            />
            <button className="bg-[color:var(--primary)] hover:bg-[color:var(--accent)] text-white font-mono text-[9px] md:text-[10px] tracking-[0.1em] uppercase px-4 md:px-5 rounded-r-full transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
