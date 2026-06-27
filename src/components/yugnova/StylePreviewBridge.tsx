import { useEffect } from "react";
import { getStyle, type StyleId } from "@/lib/designStyles";

// Lives on the public site (mounted only when ?theme_preview=1 is present,
// which only happens inside the admin panel's preview iframe — normal
// visitors never load this param, so this never affects them).
//
// Listens for postMessage({ type: "apply-style", styleId }) from the
// parent admin window and live-patches CSS variables + loads the right
// Google Font + applies shape tokens (radius/shadow/border) directly on
// document.documentElement. Nothing here is persisted — a normal reload
// without the param resets everything to the site's real default theme.
export function StylePreviewBridge() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("theme_preview") !== "1") return;

    // Let the parent know this iframe is ready to receive style messages.
    window.parent?.postMessage({ type: "preview-ready" }, "*");

    let injectedFontLink: HTMLLinkElement | null = null;

    function applyStyle(styleId: StyleId) {
      const style = getStyle(styleId);
      const root = document.documentElement;

      // 1. CSS variable overrides (colors + font family vars)
      Object.entries(style.vars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // 2. Shape tokens — exposed as CSS vars too, consumed by a small
      // injected stylesheet so cards/buttons across the site pick them up.
      root.style.setProperty("--preview-radius", style.shape.radius);
      root.style.setProperty("--preview-border-width", style.shape.borderWidth);
      root.style.setProperty("--preview-shadow", style.shape.shadow);
      root.style.setProperty(
        "--preview-card-border-style",
        style.shape.cardBorder === "none" ? "none" : style.shape.cardBorder,
      );
      root.classList.toggle("preview-uppercase-headings", style.shape.uppercaseHeadings);
      root.setAttribute("data-preview-style", style.id);

      // 3. Swap the Google Fonts <link> so the new families actually load.
      if (injectedFontLink) injectedFontLink.remove();
      injectedFontLink = document.createElement("link");
      injectedFontLink.rel = "stylesheet";
      injectedFontLink.href = style.googleFontsHref;
      document.head.appendChild(injectedFontLink);
    }

    function resetStyle() {
      const root = document.documentElement;
      Object.keys(getStyle("minimal").vars).forEach((key) => root.style.removeProperty(key));
      ["--preview-radius", "--preview-border-width", "--preview-shadow", "--preview-card-border-style"].forEach((k) =>
        root.style.removeProperty(k),
      );
      root.classList.remove("preview-uppercase-headings");
      root.removeAttribute("data-preview-style");
      if (injectedFontLink) {
        injectedFontLink.remove();
        injectedFontLink = null;
      }
    }

    function handleMessage(e: MessageEvent) {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "apply-style" && typeof e.data.styleId === "string") {
        applyStyle(e.data.styleId as StyleId);
      } else if (e.data.type === "reset-style") {
        resetStyle();
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}
