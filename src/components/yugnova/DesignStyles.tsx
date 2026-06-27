import { motion } from "framer-motion";
import { RotateCcw, Check } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { STYLES } from "@/lib/designStyles";
import { useDesignStyle } from "./DesignStyleProvider";

// A real, in-page section (same shell as Projects/Pricing/Blog) that lets
// any visitor pick one of 7 design styles and see the WHOLE site re-skin
// live — colors, fonts, shapes, and a themed photo per section. The
// choice is plain component state: it is never saved anywhere, so a page
// reload always returns to the site's real default look.
export function DesignStyles() {
  const { activeStyle, setActiveStyle } = useDesignStyle();

  return (
    <section id="design-styles" className="relative overflow-hidden py-20 md:py-28 bg-[color:var(--background)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 md:px-12">
        <SectionLabel>Design Styles</SectionLabel>
        <h2 className="font-display mt-4 font-extrabold leading-[1.05] tracking-[-0.02em]"
          style={{ fontSize: "clamp(23px, 4.5vw, 46px)" }}>
          TRY A DIFFERENT LOOK
        </h2>
        <p className="mt-4 max-w-lg text-[15px] text-[color:var(--text-soft)]">
          Pick a style below and watch the whole site re-skin instantly — colors, fonts, and every section's imagery change together. This is just a preview for you; nothing is saved, and reloading the page brings back our regular look.
        </p>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {STYLES.map((s, i) => {
            const isActive = activeStyle === s.id;
            return (
              <motion.button
                key={s.id}
                onClick={() => setActiveStyle(isActive ? null : s.id)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative rounded-2xl border p-4 text-left transition-all"
                style={{
                  borderColor: isActive ? s.swatch[1] : "var(--border-soft)",
                  background: isActive ? "var(--surface-2)" : "var(--surface)",
                }}
              >
                <div className="flex gap-1 mb-3">
                  {s.swatch.map((c, idx) => (
                    <div key={idx} className="h-8 flex-1 rounded-md border border-[color:var(--border-soft)]" style={{ background: c }} />
                  ))}
                </div>
                <div className="font-display text-[13.5px] font-bold">{s.label}</div>
                <div className="mt-0.5 text-[11px] text-[color:var(--text-dim)] leading-snug">{s.description}</div>

                {isActive && (
                  <div
                    className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full grid place-items-center"
                    style={{ background: s.swatch[1] }}
                  >
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {activeStyle && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-6 flex items-center gap-3"
          >
            <button
              onClick={() => setActiveStyle(null)}
              className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border-strong)] font-semibold text-[13px] px-4 py-2.5 hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to default look
            </button>
            <span className="text-[12px] text-[color:var(--text-dim)] font-mono">
              Previewing: {STYLES.find((s) => s.id === activeStyle)?.label}
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
