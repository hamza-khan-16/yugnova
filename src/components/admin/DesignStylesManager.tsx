import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Palette, RotateCcw, ExternalLink } from "lucide-react";
import { STYLES, type StyleId } from "@/lib/designStyles";

// Lives in the admin panel only. Renders the 7 style buttons plus a
// same-origin iframe of the real public site (with ?theme_preview=1).
// Clicking a button postMessages the chosen style into the iframe, where
// StylePreviewBridge.tsx applies it live. Nothing here persists or
// touches what real visitors see — refreshing this tab, or the iframe,
// resets to the site's actual default look.
export function DesignStylesManager() {
  const [activeStyle, setActiveStyle] = useState<StyleId | null>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "preview-ready") {
        setIframeReady(true);
        if (activeStyle) postStyle(activeStyle);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function postStyle(styleId: StyleId) {
    iframeRef.current?.contentWindow?.postMessage({ type: "apply-style", styleId }, "*");
  }

  function selectStyle(styleId: StyleId) {
    setActiveStyle(styleId);
    if (iframeReady) postStyle(styleId);
  }

  function reset() {
    setActiveStyle(null);
    iframeRef.current?.contentWindow?.postMessage({ type: "reset-style" }, "*");
  }

  function handleIframeLoad() {
    // Reloading the iframe resets readiness; the bridge will announce
    // itself again via postMessage("preview-ready").
    setIframeReady(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Palette className="w-5 h-5 text-pink-400" />
          <h2 className="text-lg font-bold text-white">Design Styles</h2>
          <span className="text-xs font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded-full">Live preview</span>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white/60 bg-white/5 hover:bg-white/10 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset to default
        </button>
      </div>

      <p className="text-xs text-white/35 mb-5 max-w-2xl leading-relaxed">
        Pick a style below to instantly preview the whole site in that look — colors, fonts, shapes, and a themed 16:9 hero photo all switch live in the frame below. To swap a placeholder for a real photo, just replace the matching file in <code className="text-white/50">public/illustrations/</code> with a JPEG of the same name (shown under each style card) — keep it 1280×720px (16:9) for the best fit. This is a preview only: nothing here is saved, and visitors to your real site never see these changes. Refreshing resets it.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {STYLES.map((s) => {
          const isActive = activeStyle === s.id;
          return (
            <button
              key={s.id}
              onClick={() => selectStyle(s.id)}
              className="relative rounded-2xl border p-3 text-left transition-all group"
              style={{
                borderColor: isActive ? s.swatch[1] : "rgba(255,255,255,0.1)",
                background: isActive ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
              }}
            >
              <div className="flex gap-1 mb-3">
                {s.swatch.map((c, i) => (
                  <div key={i} className="h-7 flex-1 rounded-md border border-white/10" style={{ background: c }} />
                ))}
              </div>
              <div className="text-xs font-bold text-white">{s.label}</div>
              <div className="text-[10px] text-white/35 mt-0.5 leading-snug">{s.description}</div>
              <div className="text-[9px] font-mono text-white/25 mt-2 truncate" title={s.heroImage}>
                {s.heroImage.split("/").pop()}
              </div>
              {isActive && (
                <motion.div
                  layoutId="active-style-dot"
                  className="absolute top-2 right-2 w-2 h-2 rounded-full"
                  style={{ background: s.swatch[1] }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8 bg-white/3">
          <div className="flex items-center gap-2 text-[11px] font-mono text-white/35 uppercase tracking-widest">
            <div className={`w-1.5 h-1.5 rounded-full ${iframeReady ? "bg-emerald-400" : "bg-white/20"}`} />
            {activeStyle ? `Previewing: ${STYLES.find((s) => s.id === activeStyle)?.label}` : "Default site"}
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-[11px] text-white/35 hover:text-white/70 transition-colors"
          >
            Open real site <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <iframe
          ref={iframeRef}
          src="/?theme_preview=1"
          onLoad={handleIframeLoad}
          className="w-full"
          style={{ height: "70vh", border: "none", background: "#fff" }}
          title="Site design preview"
        />
      </div>
    </div>
  );
}
