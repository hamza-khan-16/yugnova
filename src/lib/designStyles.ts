// Central registry of the 7 design "styles" visitors can pick from the
// public "Design Styles" section on the homepage. Each style maps to a
// full set of CSS variable overrides (colors), a Google Fonts family
// pairing, shape/border tokens (sharp vs. rounded, flat vs. shadowed),
// and 10 background images — one per major site section.
//
// This is intentionally separate from ThemeProvider (which only toggles
// light/dark) — these are full visual "skins" applied live on the real
// site. The choice is plain React state (not persisted) — reloading the
// page always resets to the site's real default look.

export type StyleId =
  | "blueprint"
  | "retro-pop"
  | "brutalist"
  | "colorful-3d"
  | "sketch"
  | "glass"
  | "minimal";

// The 10 sections that get a themed image when a style is active.
export const SECTION_KEYS = [
  "hero",
  "services",
  "about",
  "process",
  "projects",
  "testimonials",
  "reels",
  "pricing",
  "blog",
  "contact",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export type StyleDef = {
  id: StyleId;
  label: string;
  description: string;
  swatch: [string, string, string]; // 3 colors shown on the button itself
  googleFontsHref: string;
  images: Record<SectionKey, string>; // 16:9 JPEG per section for this style
  vars: Record<string, string>; // CSS variables applied to :root when active
  shape: {
    radius: string; // border radius used for cards/buttons
    borderWidth: string;
    shadow: string;
    cardBorder: string;
    uppercaseHeadings: boolean;
  };
};

// Builds the image map for a style, e.g.
// /illustrations/blueprint/hero-PUT-IMAGE-HERE.jpg
function imagesFor(styleId: StyleId): Record<SectionKey, string> {
  const map = {} as Record<SectionKey, string>;
  for (const key of SECTION_KEYS) {
    map[key] = `/illustrations/${styleId}/${key}-PUT-IMAGE-HERE.jpeg`;
  }
  return map;
}

const ALL_STYLES: StyleDef[] = [
  {
    id: "blueprint",
    label: "Blueprint",
    description: "Technical navy blueprint sketch",
    swatch: ["#002850", "#1d6fc4", "#ffffff"],
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=Space+Mono:wght@400;700&display=swap",
    images: imagesFor("blueprint"),
    vars: {
      "--background": "#002850",
      "--foreground": "#eaf2ff",
      "--surface": "#0c3568",
      "--surface-2": "#123d72",
      "--border-soft": "rgba(255,255,255,0.18)",
      "--border-strong": "rgba(255,255,255,0.32)",
      "--text-soft": "rgba(234,242,255,0.72)",
      "--text-dim": "rgba(234,242,255,0.45)",
      "--primary": "#1d6fc4",
      "--primary-foreground": "#ffffff",
      "--accent": "#ffffff",
      "--font-display": "'Space Grotesk', sans-serif",
      "--font-body": "'Space Mono', monospace",
      "--font-mono": "'Space Mono', monospace",
    },
    shape: { radius: "4px", borderWidth: "1px", shadow: "none", cardBorder: "dashed", uppercaseHeadings: true },
  },
  {
    id: "retro-pop",
    label: "Retro Pop",
    description: "80s cream, pink & teal pop-art",
    swatch: ["#f8ead2", "#e6305f", "#3d7d6e"],
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&display=swap",
    images: imagesFor("retro-pop"),
    vars: {
      "--background": "#f8ead2",
      "--foreground": "#1a1a1a",
      "--surface": "#fffaf0",
      "--surface-2": "#ece0c4",
      "--border-soft": "rgba(0,0,0,0.18)",
      "--border-strong": "rgba(0,0,0,0.85)",
      "--text-soft": "rgba(26,26,26,0.7)",
      "--text-dim": "rgba(26,26,26,0.45)",
      "--primary": "#e6305f",
      "--primary-foreground": "#fffaf0",
      "--accent": "#3d7d6e",
      "--font-display": "'Archivo Black', sans-serif",
      "--font-body": "'Space Grotesk', sans-serif",
      "--font-mono": "'Space Grotesk', sans-serif",
    },
    shape: { radius: "2px", borderWidth: "3px", shadow: "4px 4px 0 rgba(0,0,0,0.85)", cardBorder: "solid", uppercaseHeadings: true },
  },
  {
    id: "brutalist",
    label: "Brutalist",
    description: "Mono black, white & cobalt blue",
    swatch: ["#f0eee8", "#000000", "#0f1ce8"],
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&display=swap",
    images: imagesFor("brutalist"),
    vars: {
      "--background": "#f0eee8",
      "--foreground": "#0a0a0a",
      "--surface": "#ffffff",
      "--surface-2": "#e4e2df",
      "--border-soft": "rgba(0,0,0,0.15)",
      "--border-strong": "rgba(0,0,0,1)",
      "--text-soft": "rgba(10,10,10,0.68)",
      "--text-dim": "rgba(10,10,10,0.4)",
      "--primary": "#0f1ce8",
      "--primary-foreground": "#ffffff",
      "--accent": "#000000",
      "--font-display": "'Archivo Black', sans-serif",
      "--font-body": "'Inter', sans-serif",
      "--font-mono": "'Inter', sans-serif",
    },
    shape: { radius: "0px", borderWidth: "2px", shadow: "none", cardBorder: "solid", uppercaseHeadings: false },
  },
  {
    id: "colorful-3d",
    label: "Colorful 3D",
    description: "Playful purple, pink & teal gradients",
    swatch: ["#3a1ce3", "#ec4899", "#22d3ee"],
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Poppins:wght@300;400;500;600&display=swap",
    images: imagesFor("colorful-3d"),
    vars: {
      "--background": "#faf6f8",
      "--foreground": "#241a33",
      "--surface": "#ffffff",
      "--surface-2": "#f3eafc",
      "--border-soft": "rgba(58,28,227,0.18)",
      "--border-strong": "rgba(58,28,227,0.35)",
      "--text-soft": "rgba(36,26,51,0.68)",
      "--text-dim": "rgba(36,26,51,0.42)",
      "--primary": "#3a1ce3",
      "--primary-foreground": "#ffffff",
      "--accent": "#ec4899",
      "--font-display": "'Baloo 2', sans-serif",
      "--font-body": "'Poppins', sans-serif",
      "--font-mono": "'Poppins', sans-serif",
    },
    shape: { radius: "20px", borderWidth: "0px", shadow: "0 12px 28px rgba(58,28,227,0.18)", cardBorder: "none", uppercaseHeadings: false },
  },
  {
    id: "sketch",
    label: "Sketch",
    description: "Hand-drawn pencil on white",
    swatch: ["#fafafa", "#3b5fc4", "#0a0a0a"],
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Inter:wght@400;500;600&display=swap",
    images: imagesFor("sketch"),
    vars: {
      "--background": "#fafafa",
      "--foreground": "#1a1a1a",
      "--surface": "#ffffff",
      "--surface-2": "#f0f0f0",
      "--border-soft": "rgba(20,20,20,0.25)",
      "--border-strong": "rgba(20,20,20,0.55)",
      "--text-soft": "rgba(26,26,26,0.68)",
      "--text-dim": "rgba(26,26,26,0.42)",
      "--primary": "#3b5fc4",
      "--primary-foreground": "#ffffff",
      "--accent": "#6b7280",
      "--font-display": "'Architects Daughter', cursive",
      "--font-body": "'Inter', sans-serif",
      "--font-mono": "'Inter', sans-serif",
    },
    shape: { radius: "10px", borderWidth: "1.5px", shadow: "none", cardBorder: "solid", uppercaseHeadings: false },
  },
  {
    id: "glass",
    label: "Glassmorphism",
    description: "Frosted glass, soft blue & violet",
    swatch: ["#cdd9f5", "#4565ee", "#a78bfa"],
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap",
    images: imagesFor("glass"),
    vars: {
      "--background": "#cdd9f5",
      "--foreground": "#1c2333",
      "--surface": "rgba(255,255,255,0.45)",
      "--surface-2": "rgba(255,255,255,0.28)",
      "--border-soft": "rgba(255,255,255,0.55)",
      "--border-strong": "rgba(255,255,255,0.8)",
      "--text-soft": "rgba(28,35,51,0.68)",
      "--text-dim": "rgba(28,35,51,0.42)",
      "--primary": "#4565ee",
      "--primary-foreground": "#ffffff",
      "--accent": "#a78bfa",
      "--font-display": "'Outfit', sans-serif",
      "--font-body": "'Outfit', sans-serif",
      "--font-mono": "'Outfit', sans-serif",
    },
    shape: { radius: "18px", borderWidth: "1px", shadow: "0 8px 32px rgba(69,101,238,0.25)", cardBorder: "solid", uppercaseHeadings: false },
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Clean white & cobalt, no clutter",
    swatch: ["#f8f8f8", "#055aed", "#0f172a"],
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
    images: imagesFor("minimal"),
    vars: {
      "--background": "#ffffff",
      "--foreground": "#0f172a",
      "--surface": "#fafafa",
      "--surface-2": "#f1f1f1",
      "--border-soft": "rgba(15,23,42,0.1)",
      "--border-strong": "rgba(15,23,42,0.18)",
      "--text-soft": "rgba(15,23,42,0.65)",
      "--text-dim": "rgba(15,23,42,0.4)",
      "--primary": "#055aed",
      "--primary-foreground": "#ffffff",
      "--accent": "#0f172a",
      "--font-display": "'Inter', sans-serif",
      "--font-body": "'Inter', sans-serif",
      "--font-mono": "'Inter', sans-serif",
    },
    shape: { radius: "8px", borderWidth: "1px", shadow: "none", cardBorder: "solid", uppercaseHeadings: false },
  },
];

// TEMPORARILY DISABLED: "Glass" (glassmorphism), "Brutalist", and "Minimal"
// are commented out of the public-facing picker for now. Their full
// definitions stay in ALL_STYLES above, so re-enabling them later is just
// removing the id from this list.
const DISABLED_STYLE_IDS: StyleId[] = [
  "glass",
  "brutalist",
  "minimal",
];

export const STYLES: StyleDef[] = ALL_STYLES.filter(
  (s) => !DISABLED_STYLE_IDS.includes(s.id),
);

export function getStyle(id: StyleId): StyleDef {
  return ALL_STYLES.find((s) => s.id === id) ?? ALL_STYLES[0];
}
