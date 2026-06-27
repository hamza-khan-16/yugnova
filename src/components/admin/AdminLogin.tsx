import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, Shield } from "lucide-react";
import { adminLogin } from "@/lib/adminAuth";

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const ok = await adminLogin(username, password);
      if (ok) {
        onSuccess();
      } else {
        setError("Invalid username or password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.15) 0%, transparent 60%), #08080a",
      }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #d946ef, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #22d3ee, transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div
          className="rounded-3xl p-8 md:p-10 border"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)",
          }}
        >
          {/* Logo / Icon */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
              }}
            >
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1
              className="text-2xl font-bold text-white tracking-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              YUGNOVA Admin
            </h1>
            <p className="text-sm mt-1 opacity-50 text-white">
              Restricted access — authorised personnel only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase text-white/40 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Enter username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(139,92,246,0.5)";
                    e.target.style.background = "rgba(139,92,246,0.06)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.08)";
                    e.target.style.background = "rgba(255,255,255,0.05)";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase text-white/40 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(139,92,246,0.5)";
                    e.target.style.background = "rgba(139,92,246,0.06)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.08)";
                    e.target.style.background = "rgba(255,255,255,0.05)";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 text-center py-2 px-4 rounded-lg"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 mt-2 disabled:opacity-60"
              style={{
                background: loading
                  ? "rgba(139,92,246,0.4)"
                  : "linear-gradient(135deg, #8b5cf6, #22d3ee)",
                boxShadow: loading ? "none" : "0 8px 32px rgba(139,92,246,0.3)",
              }}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
