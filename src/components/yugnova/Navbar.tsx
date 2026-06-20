import { useEffect, useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-2.5" : "py-4 sm:py-5"}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className={`flex items-center justify-between rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 transition-all duration-500 ${scrolled ? "glass-strong" : "glass"}`}>
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 font-display text-lg sm:text-xl font-bold tracking-tight">
            <span className="inline-block h-2 w-2 rounded-full gradient-bg animate-pulse-glow" />
            YUG<span className="gradient-text">NOVA</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative px-3 lg:px-4 py-2 text-[13px] lg:text-sm text-[color:var(--text-soft)] hover:text-[color:var(--foreground)] transition-colors group"
              >
                {l.label}
                <span className="absolute inset-x-3 lg:inset-x-4 -bottom-0.5 h-px scale-x-0 group-hover:scale-x-100 origin-left transition-transform gradient-bg" />
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="grid place-items-center h-9 w-9 sm:h-10 sm:w-10 rounded-full glass hover:glow-primary transition-all"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </button>
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-[12px] sm:text-sm font-medium text-white gradient-bg hover:scale-105 transition-transform"
            >
              Let's Talk
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              className="md:hidden grid place-items-center h-9 w-9 rounded-full glass"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 glass-strong rounded-2xl p-3 flex flex-col gap-0.5"
            >
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl hover:bg-[color:var(--surface-2)] text-[14px] font-medium transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 w-full text-center rounded-full px-5 py-3 text-sm font-semibold text-white gradient-bg"
              >
                Let's Talk
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
