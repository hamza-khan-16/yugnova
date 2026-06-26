import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#projects" },
  { label: "About Us", href: "#about" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b border-[color:var(--border-soft)] ${
        scrolled ? "bg-[color:var(--background)]/90 backdrop-blur-xl" : "bg-[color:var(--background)]/70 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 md:px-12">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
            <span className="grid place-items-center h-7 w-7 rounded-[8px] bg-[color:var(--foreground)] text-[color:var(--background)] text-[14px] font-extrabold">Y</span>
            YUGNOVA
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative text-[14px] font-medium text-[color:var(--text-soft)] hover:text-[color:var(--primary)] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-bold bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:-translate-y-0.5 transition-transform"
            >
              Let's Talk ↗
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              className="md:hidden grid place-items-center h-9 w-9 rounded-lg border border-[color:var(--border-strong)]"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden pb-4 flex flex-col gap-1 border-t border-[color:var(--border-soft)] pt-3"
            >
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg hover:bg-[color:var(--surface)] text-[14px] font-medium transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 text-center rounded-lg px-5 py-3 text-sm font-bold bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
              >
                Let's Talk ↗
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
