import { useEffect, useState } from "react";
import type { StyleId } from "@/lib/designStyles";

// Tiny hook so individual components (like Hero) can render a themed
// illustration only while the admin preview iframe has applied a style.
// Reads the `data-preview-style` attribute that StylePreviewBridge sets
// on <html>, and re-renders whenever it changes via a MutationObserver.
export function usePreviewStyle(): StyleId | null {
  const [styleId, setStyleId] = useState<StyleId | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    const read = () => {
      const attr = root.getAttribute("data-preview-style");
      setStyleId((attr as StyleId) || null);
    };

    read();

    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-preview-style"] });
    return () => observer.disconnect();
  }, []);

  return styleId;
}
