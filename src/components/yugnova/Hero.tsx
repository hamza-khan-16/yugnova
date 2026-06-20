import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const words = ["AI Solutions", "Web Development", "Mobile Apps", "Cloud Solutions", "Cyber Security"];

function Typewriter() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[i];
    const speed = del ? 40 : 90;
    const t = setTimeout(() => {
      if (!del) {
        if (text.length < word.length) setText(word.slice(0, text.length + 1));
        else setTimeout(() => setDel(true), 1500);
      } else {
        if (text.length > 0) setText(word.slice(0, text.length - 1));
        else { setDel(false); setI((p) => (p + 1) % words.length); }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, i]);
  return (
    <span className="font-display font-bold text-[color:var(--primary)] tracking-tight">
      {text}
      <span className="inline-block w-[3px] h-[0.85em] bg-[color:var(--primary)] align-middle ml-1 animate-pulse rounded-sm" />
    </span>
  );
}

function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    // Fewer particles on small screens for perf
    const count = Math.min(70, Math.floor((w * h) / 18000));
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.4,
    }));
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,164,255,0.65)"; ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j]; const dx = p.x - q.x, dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.strokeStyle = `rgba(0,71,171,${0.28 * (1 - d / 130)})`;
            ctx.lineWidth = 0.6; ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-70" />;
}

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden noise">
      <Particles />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] md:h-[700px] md:w-[700px] rounded-full opacity-60"
        style={{ background: "radial-gradient(circle, rgba(0,71,171,0.18) 0%, transparent 70%)" }} />
      <div className="absolute top-[10%] -right-24 h-[250px] w-[250px] md:h-[400px] md:w-[400px] rounded-full opacity-[0.07] animate-blob gradient-bg" />
      <div className="absolute bottom-[18%] -left-16 h-36 w-36 md:h-52 md:w-52 opacity-[0.08] animate-blob bg-[color:var(--primary)]"
        style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%", animationDelay: "-3s" }} />

      <div className="relative z-10 mx-auto max-w-[1280px] w-full px-5 sm:px-8 md:px-12 pt-28 sm:pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full bg-[color:var(--surface)] border border-[color:var(--border-strong)] px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-[10px] sm:text-[11px] tracking-[0.08em] sm:tracking-[0.1em] uppercase text-[color:var(--text-soft)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary)] animate-pulse shrink-0" />
          <span className="hidden sm:inline">Available for New Projects · India · Remote-First</span>
          <span className="sm:hidden">Available for New Projects</span>
        </motion.div>

        <h1 className="font-display mt-7 sm:mt-10 font-extrabold leading-[0.92] tracking-[-0.04em]"
          style={{ fontSize: "clamp(44px, 8.5vw, 130px)" }}>
          {["BUILDING", "THE FUTURE", "WITH YUGNOVA"].map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.15, ease: [0.23, 1, 0.32, 1] }}
                className={`block ${i === 1 ? "gradient-text" : ""}`}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="font-display mt-5 sm:mt-8 font-bold tracking-tight min-h-[1.2em]"
          style={{ fontSize: "clamp(22px, 4.5vw, 64px)" }}>
          <Typewriter />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-6 sm:mt-10 max-w-xl text-[15px] sm:text-base md:text-lg leading-relaxed text-[color:var(--text-soft)]"
        >
          We craft extraordinary digital experiences — from AI-powered platforms to breathtaking interfaces — turning bold ideas into world-class products.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.95 }}
          className="mt-8 sm:mt-12 flex flex-wrap gap-3 sm:gap-4"
        >
          <a href="#projects"
            className="group inline-flex items-center gap-2 sm:gap-2.5 rounded-full gradient-bg text-white font-mono text-[11px] sm:text-xs tracking-[0.08em] sm:tracking-[0.1em] uppercase px-6 sm:px-8 py-3.5 sm:py-4 hover:scale-[1.04] hover:-translate-y-0.5 transition-all hover:glow-primary">
            View Our Work <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a href="#contact"
            className="group inline-flex items-center gap-2 sm:gap-2.5 rounded-full bg-[color:var(--surface)] border border-[color:var(--border-strong)] font-mono text-[11px] sm:text-xs tracking-[0.08em] sm:tracking-[0.1em] uppercase px-6 sm:px-8 py-3.5 sm:py-4 hover:border-[color:var(--primary)] hover:-translate-y-0.5 transition-all">
            Start a Project <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-8 sm:bottom-10 left-5 sm:left-12 z-10 flex items-center gap-3 font-mono text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-[color:var(--text-dim)]">
        <div className="relative h-px w-8 sm:w-10 bg-[color:var(--text-dim)] overflow-hidden">
          <span className="absolute inset-y-0 -left-full w-full bg-[color:var(--primary)] animate-[scroll-slide_2s_ease-in-out_infinite]" />
        </div>
        Scroll to explore
      </div>
      <style>{`@keyframes scroll-slide{0%{left:-100%}100%{left:100%}}`}</style>
    </section>
  );
}
