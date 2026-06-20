export function SectionLabel({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div
      className={`font-mono text-[11px] tracking-[0.2em] uppercase text-[color:var(--primary)] flex items-center gap-3 ${
        center ? "justify-center" : ""
      }`}
    >
      <span className="h-px w-8 bg-[color:var(--primary)]" />
      {children}
    </div>
  );
}
