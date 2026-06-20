const tech = ["React", "Next.js", "Node.js", "MongoDB", "AI", "Machine Learning", "Flutter", "AWS", "Docker", "Kubernetes", "TypeScript", "Python"];

export function Marquee() {
  const items = [...tech, ...tech];
  return (
    <section className="relative border-y border-[color:var(--border-soft)] py-5 sm:py-7 md:py-8 overflow-hidden bg-[color:var(--surface)]">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((t, i) => (
          <div key={i} className="flex items-center gap-6 sm:gap-10 md:gap-12 px-4 sm:px-6 md:px-8">
            <span className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[color:var(--text-soft)] hover:text-[color:var(--foreground)] transition-colors cursor-default">
              {t}
            </span>
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full gradient-bg shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
}
