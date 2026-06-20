import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Heart, MessageCircle, Share2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { supabase, type Reel as DbReel } from "@/lib/supabase";

type Reel = {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  poster: string;
  video: string;
  likes: string;
};

const FALLBACK_REELS: Reel[] = [
  {
    id: "1", name: "Aarav Mehta", role: "Founder, Nexa Labs", rating: 5,
    text: "YUGNOVA shipped our AI platform in 6 weeks. Insane execution.",
    poster: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=70",
    video: "https://cdn.coverr.co/videos/coverr-typing-on-a-laptop-keyboard-1573/1080p.mp4",
    likes: "12.4K",
  },
  {
    id: "2", name: "Sara Kapoor", role: "CMO, Lumio", rating: 5,
    text: "The mobile app feels premium. Our retention jumped 38%.",
    poster: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=70",
    video: "https://cdn.coverr.co/videos/coverr-a-woman-using-her-phone-on-the-couch-2767/1080p.mp4",
    likes: "8.9K",
  },
  {
    id: "3", name: "Rohit Verma", role: "CTO, FinPeak", rating: 5,
    text: "Cloud infra is rock solid. Zero downtime in 9 months.",
    poster: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=70",
    video: "https://cdn.coverr.co/videos/coverr-a-man-working-on-his-computer-7757/1080p.mp4",
    likes: "15.2K",
  },
  {
    id: "4", name: "Priya Nair", role: "Product Lead, Orbit", rating: 5,
    text: "Design + engineering in one team. Total game changer.",
    poster: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=70",
    video: "https://cdn.coverr.co/videos/coverr-young-woman-working-on-her-laptop-4434/1080p.mp4",
    likes: "20.1K",
  },
  {
    id: "5", name: "Daniel Park", role: "CEO, Voltra", rating: 5,
    text: "Best agency partner we've worked with. Period.",
    poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=70",
    video: "https://cdn.coverr.co/videos/coverr-a-businessman-with-a-tablet-5067/1080p.mp4",
    likes: "9.7K",
  },
];

function toReel(r: DbReel): Reel {
  return { id: r.id, name: r.name, role: r.role, rating: r.rating, text: r.text, poster: r.poster, video: r.video, likes: r.likes };
}

function ReelCard({ reel, index }: { reel: Reel; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) play();
    else v.pause();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex-shrink-0 w-[240px] sm:w-[280px] md:w-[300px] aspect-[9/16] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer snap-center group"
      style={{ background: "var(--glass)", border: "1px solid var(--border)", boxShadow: "0 30px 80px -30px rgba(0,0,0,.5)" }}
      onClick={toggle}
      onMouseEnter={() => { const v = videoRef.current; if (v && v.paused) play(); }}
    >
      <video
        ref={videoRef}
        src={reel.video}
        poster={reel.poster}
        loop
        muted={muted}
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

      {/* Top bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-0.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
          {Array.from({ length: reel.rating }).map((_, i) => (
            <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <button onClick={(e) => { e.stopPropagation(); const v = videoRef.current; if (v) { v.muted = !muted; setMuted(!muted); } }}
          className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:scale-110 transition-transform">
          {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Play icon */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <motion.div animate={{ opacity: playing ? 0 : 1, scale: playing ? 0.7 : 1 }} transition={{ duration: 0.2 }}
          className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
          {playing ? <Pause className="w-5 h-5 md:w-7 md:h-7 text-white" /> : <Play className="w-5 h-5 md:w-7 md:h-7 text-white ml-0.5 md:ml-1" />}
        </motion.div>
      </div>

      {/* Right rail */}
      <div className="absolute right-2.5 bottom-24 md:bottom-28 flex flex-col gap-3 md:gap-4 z-10">
        <button onClick={(e) => { e.stopPropagation(); setLiked(!liked); }} className="flex flex-col items-center gap-1 text-white">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:scale-110 transition-transform">
            <Heart className={`w-4 h-4 md:w-5 md:h-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          </div>
          <span className="text-[9px] md:text-[10px] font-mono">{reel.likes}</span>
        </button>
        <button onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-1 text-white">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:scale-110 transition-transform">
            <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="text-[9px] md:text-[10px] font-mono">238</span>
        </button>
        <button onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-1 text-white">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:scale-110 transition-transform">
            <Share2 className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="text-[9px] md:text-[10px] font-mono">Share</span>
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-10 text-white">
        <div className="flex items-center gap-2 mb-1.5 md:mb-2">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 p-[2px] shrink-0">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold">
              {reel.name.charAt(0)}
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[12px] md:text-sm font-semibold truncate">{reel.name}</div>
            <div className="text-[10px] md:text-[11px] opacity-70 truncate">{reel.role}</div>
          </div>
        </div>
        <p className="text-[11px] md:text-[13px] leading-snug line-clamp-3 opacity-95">"{reel.text}"</p>
      </div>
    </motion.div>
  );
}

export function Reels() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [reels, setReels] = useState<Reel[]>(FALLBACK_REELS);

  useEffect(() => {
    supabase
      .from("reels")
      .select("*")
      .order("order_index")
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setReels(data.map(toReel));
        }
      });
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  };

  return (
    <section id="reels" className="relative py-20 md:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/3 w-[300px] md:w-[480px] h-[300px] md:h-[480px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #d946ef, transparent 70%)" }} />
        <div className="absolute bottom-10 right-1/4 w-[260px] md:w-[420px] h-[260px] md:h-[420px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #22d3ee, transparent 70%)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 mb-10 md:mb-12">
        <SectionLabel>— Video Feedback</SectionLabel>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mt-4">
          <h2 className="font-display font-bold leading-[0.95] tracking-tight" style={{ fontSize: "clamp(34px, 6vw, 84px)" }}>
            Real People. <br />
            <span className="gradient-text">Real Reels.</span>
          </h2>
          <p className="max-w-sm text-[14px] md:text-base opacity-70">
            Short, unscripted feedback from founders, product leads and operators we've shipped with.
          </p>
        </div>

        {/* Scroll arrows — visible on all sizes */}
        <div className="flex gap-3 mt-6">
          <button onClick={() => scroll("left")}
            className="w-9 h-9 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface)] flex items-center justify-center text-[color:var(--text-soft)] hover:text-[color:var(--primary)] hover:border-[color:var(--primary)] transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll("right")}
            className="w-9 h-9 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface)] flex items-center justify-center text-[color:var(--text-soft)] hover:text-[color:var(--primary)] hover:border-[color:var(--primary)] transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div ref={scrollerRef}
        className="relative flex gap-4 md:gap-5 lg:gap-7 overflow-x-auto pb-8 px-6 md:px-12 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none" }}>
        {reels.map((r, i) => <ReelCard key={r.id} reel={r} index={i} />)}
        <div className="flex-shrink-0 w-2" />
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar{display:none;}`}</style>
    </section>
  );
}
