import { useDesignStyle } from "@/components/yugnova/DesignStyleProvider";
import { getStyle, type SectionKey } from "@/lib/designStyles";

// Used by each of the 10 themed sections (Hero, Services, About, Process,
// Projects, Testimonials, Reels, Pricing, Blog, Contact) to look up the
// active style's image for that section. Returns null when no style is
// selected, so each section can fall back to its normal background photo.
export function useSectionStyleImage(section: SectionKey): string | null {
  const { activeStyle } = useDesignStyle();
  if (!activeStyle) return null;
  return getStyle(activeStyle).images[section];
}
