import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getStyle, type StyleId } from "@/lib/designStyles";

type Ctx = {
  activeStyle: StyleId | null;
  setActiveStyle: (id: StyleId | null) => void;
};

const DesignStyleCtx = createContext<Ctx>({
  activeStyle: null,
  setActiveStyle: () => {},
});

// Drives the public "Design Styles" section. Picking a style here applies
// its colors, fonts, and shape tokens directly to the real page via CSS
// variables on <html> — visible to whoever is looking at the site right
// now. Deliberately NOT persisted to localStorage/cookies/DB: a reload
// always goes back to the site's real default look, as requested.
export function DesignStyleProvider({ children }: { children: ReactNode }) {
  const [activeStyle, setActiveStyle] = useState<StyleId | null>(null);
  const [injectedFontLink, setInjectedFontLink] = useState<HTMLLinkElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    if (!activeStyle) {
      // Reset: remove every var we might have set, plus shape tokens.
      const allVarKeys = new Set<string>();
      getStyle("minimal");
      for (const s of [
        "blueprint", "retro-pop", "brutalist", "colorful-3d", "sketch", "glass", "minimal",
      ] as StyleId[]) {
        Object.keys(getStyle(s).vars).forEach((k) => allVarKeys.add(k));
      }
      allVarKeys.forEach((k) => root.style.removeProperty(k));
      ["--preview-radius", "--preview-border-width", "--preview-shadow", "--preview-card-border-style"].forEach((k) =>
        root.style.removeProperty(k),
      );
      root.classList.remove("preview-uppercase-headings");
      root.removeAttribute("data-preview-style");
      if (injectedFontLink) {
        injectedFontLink.remove();
        setInjectedFontLink(null);
      }
      return;
    }

    const style = getStyle(activeStyle);

    Object.entries(style.vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    root.style.setProperty("--preview-radius", style.shape.radius);
    root.style.setProperty("--preview-border-width", style.shape.borderWidth);
    root.style.setProperty("--preview-shadow", style.shape.shadow);
    root.style.setProperty("--preview-card-border-style", style.shape.cardBorder === "none" ? "none" : style.shape.cardBorder);
    root.classList.toggle("preview-uppercase-headings", style.shape.uppercaseHeadings);
    root.setAttribute("data-preview-style", style.id);

    if (injectedFontLink) injectedFontLink.remove();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = style.googleFontsHref;
    document.head.appendChild(link);
    setInjectedFontLink(link);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStyle]);

  // Always reset on a real page reload/unmount, never persisted.
  useEffect(() => {
    return () => {
      const root = document.documentElement;
      if (injectedFontLink) injectedFontLink.remove();
      root.removeAttribute("data-preview-style");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DesignStyleCtx.Provider value={{ activeStyle, setActiveStyle }}>
      {children}
    </DesignStyleCtx.Provider>
  );
}

export const useDesignStyle = () => useContext(DesignStyleCtx);
