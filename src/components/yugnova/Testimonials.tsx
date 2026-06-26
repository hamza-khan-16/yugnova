import { SectionLabel } from "./SectionLabel";

const tns = [
  { name: "Aarav Mehta", role: "CEO, Nimbus Labs", text: "YUGNOVA shipped our AI platform in 9 weeks. The craft, the speed, the partnership — unmatched." },
  { name: "Sofia Rinaldi", role: "Head of Product, Helix", text: "Easily the most thoughtful design and engineering team we've worked with. They sweat every detail." },
  { name: "Daniel Park", role: "Founder, Orbit", text: "From discovery to launch, they felt like an in-house team. Our app store rating jumped to 4.9." },
  { name: "Priya Shah", role: "CTO, PulseHealth", text: "Brilliant engineers who actually understand product. The code quality is in a league of its own." },
  { name: "Marcus Bauer", role: "VP Design, Atlas", text: "The brand and design system they built has scaled with us for two years and still feels fresh." },
];

function Card({ t }: { t: (typeof tns)[number] }) {
  return (
    <div className="relative shrink-0 w-[78vw] xs:w-[320px] sm:w-[360px] md:w-[420px] max-w-[420px] rounded-3xl bg-[color:var(--surface)] border border-[color:var(--border-strong)] p-6 sm:p-8 md:p-10 backdrop-blur-xl hover:border-[color:var(--primary)] hover:-translate-y-1 transition-all overflow-hidden">
      <span className="absolute -top-2 right-6 font-display text-[100px] md:text-[120px] leading-none text-[color:var(--primary)] opacity-[0.07]">"</span>
      <div className="font-mono text-xs tracking-[0.2em] text-[color:var(--primary)] mb-4">★★★★★</div>
      <p className="relative text-[14px] md:text-[16px] leading-[1.75] text-[color:var(--text-soft)] mb-7 break-words">"{t.text}"</p>
      <div className="flex items-center gap-3.5">
        <div className="h-10 w-10 md:h-11 md:w-11 rounded-full gradient-bg grid place-items-center font-display text-base md:text-lg font-bold text-[color:var(--primary-foreground)] border-2 border-[color:var(--primary)]/30 shrink-0">
          {t.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="font-display text-[14px] md:text-[15px] font-bold truncate">{t.name}</div>
          <div className="mt-0.5 font-mono text-[9px] md:text-[10px] tracking-[0.1em] uppercase text-[color:var(--text-dim)] truncate">{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const loop = [...tns, ...tns];
  return (
    <section id="testimonials" className="relative py-20 md:py-28 lg:py-32 bg-[color:var(--background)] overflow-hidden">
      
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto">
          <SectionLabel center>Kind Words</SectionLabel>
          <h2 className="font-display mt-6 text-[clamp(20px,4.5vw,56px)] font-extrabold leading-[1.05] tracking-[-0.03em] break-words">
            Trusted by teams who <span className="gradient-text">ship</span>
          </h2>
        </div>
      </div>

      <div className="relative mt-12 md:mt-16 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-16 md:w-24 z-10 bg-gradient-to-r from-[color:var(--background)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-16 md:w-24 z-10 bg-gradient-to-l from-[color:var(--background)] to-transparent" />
        <div className="flex w-max gap-4 md:gap-6 animate-marquee pl-4 sm:pl-6 md:pl-12" style={{ animationDuration: "40s" }}>
          {loop.map((t, i) => <Card key={i} t={t} />)}
        </div>
      </div>
    </section>
  );
}
