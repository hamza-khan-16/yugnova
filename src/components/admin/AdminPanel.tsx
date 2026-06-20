import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film, FolderKanban, BadgeIndianRupee, LogOut, Menu, X,
  LayoutDashboard, ChevronRight,
} from "lucide-react";
import { adminLogout } from "@/lib/adminAuth";
import { ReelsManager } from "./ReelsManager";
import { ProjectsManager } from "./ProjectsManager";
import { PlansManager } from "./PlansManager";

type Tab = "reels" | "projects" | "plans";

const NAV = [
  { id: "reels" as Tab, label: "Reels", icon: Film, color: "text-violet-400", accent: "rgba(139,92,246,0.15)" },
  { id: "projects" as Tab, label: "Projects", icon: FolderKanban, color: "text-cyan-400", accent: "rgba(34,211,238,0.15)" },
  { id: "plans" as Tab, label: "Plans & Pricing", icon: BadgeIndianRupee, color: "text-emerald-400", accent: "rgba(52,211,153,0.15)" },
];

export function AdminPanel() {
  const [tab, setTab] = useState<Tab>("reels");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await adminLogout();
    window.location.reload();
  };

  const active = NAV.find((n) => n.id === tab)!;

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#08080a", fontFamily: "DM Sans, sans-serif" }}
    >
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{
          width: 260,
          background: "rgba(255,255,255,0.025)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/7">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#22d3ee)" }}>
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
                YUGNOVA
              </div>
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="text-[10px] font-mono tracking-widest uppercase text-white/20 px-3 mb-3">Content</div>
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
                style={{
                  background: isActive ? item.accent : "transparent",
                  color: isActive ? "white" : "rgba(255,255,255,0.45)",
                }}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? item.color : "text-white/30 group-hover:text-white/60"}`} />
                <span className={isActive ? "text-white" : "group-hover:text-white/70"}>{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/30" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/7">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-4 px-6 py-4 border-b border-white/7"
          style={{ background: "rgba(8,8,10,0.8)", backdropFilter: "blur(20px)" }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 text-white/60 hover:bg-white/10 transition-all"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <active.icon className={`w-4 h-4 ${active.color}`} />
            <h1 className="text-sm font-semibold text-white">{active.label}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/30 font-mono">Live</span>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "reels" && <ReelsManager />}
              {tab === "projects" && <ProjectsManager />}
              {tab === "plans" && <PlansManager />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
