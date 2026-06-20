import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Save, X, GripVertical, Film } from "lucide-react";
import { supabase, type Reel } from "@/lib/supabase";
import { adminDeleteRowFn, adminSaveRowFn } from "@/lib/api/adminData.functions";
import { toast } from "sonner";

const EMPTY: Omit<Reel, "id" | "created_at"> = {
  name: "", role: "", rating: 5, text: "",
  poster: "", video: "", likes: "0", order_index: 0,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono tracking-widest uppercase text-white/40 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inp = "w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all placeholder-white/20";

export function ReelsManager() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Reel | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchReels = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("reels").select("*").order("order_index");
    if (error) toast.error("Failed to load reels: " + error.message);
    else setReels(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchReels(); }, []);

  const openNew = () => {
    setIsNew(true);
    setEditing({ ...EMPTY, id: "", order_index: reels.length } as Reel);
  };

  const openEdit = (r: Reel) => { setIsNew(false); setEditing({ ...r }); };

  const close = () => { setEditing(null); setIsNew(false); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (isNew) {
        const { id: _id, created_at: _c, ...payload } = editing as any;
        await adminSaveRowFn({ data: { table: "reels", payload } });
        toast.success("Reel added!");
      } else {
        const { id, created_at: _c, ...payload } = editing as any;
        await adminSaveRowFn({ data: { table: "reels", id, payload } });
        toast.success("Reel updated!");
      }
      close();
      fetchReels();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save reel");
    }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this reel?")) return;
    setDeleting(id);
    try {
      await adminDeleteRowFn({ data: { table: "reels", id } });
      toast.success("Deleted");
      fetchReels();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete reel");
    }
    setDeleting(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Film className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-bold text-white">Reels</h2>
          <span className="text-xs font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{reels.length}</span>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg,#8b5cf6,#22d3ee)" }}>
          <Plus className="w-4 h-4" /> Add Reel
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-white/30 text-sm">Loading...</div>
      ) : reels.length === 0 ? (
        <div className="text-center py-16 text-white/30 text-sm">No reels yet. Click "Add Reel" to create one.</div>
      ) : (
        <div className="space-y-3">
          {reels.map((r) => (
            <motion.div key={r.id} layout
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/8 bg-white/3 group"
            >
              <GripVertical className="w-4 h-4 text-white/20 flex-shrink-0" />
              <img src={r.poster} alt="" className="w-12 h-16 object-cover rounded-xl flex-shrink-0 bg-white/5" onError={(e) => { (e.target as HTMLImageElement).src = ""; }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{r.name}</div>
                <div className="text-xs text-white/40 truncate">{r.role}</div>
                <div className="text-xs text-white/30 mt-1 truncate">❤️ {r.likes} · ⭐ {r.rating}</div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-violet-500/20 text-white/50 hover:text-violet-400 transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => del(r.id)} disabled={deleting === r.id} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
            <motion.div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 p-6 space-y-4"
              style={{ background: "#0e0e12" }}
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{isNew ? "Add Reel" : "Edit Reel"}</h3>
                <button onClick={close} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <Field label="Person Name"><input className={inp} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Aarav Mehta" /></Field>
              <Field label="Role"><input className={inp} value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value })} placeholder="Founder, Nexa Labs" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Rating (1–5)"><input className={inp} type="number" min={1} max={5} value={editing.rating} onChange={e => setEditing({ ...editing, rating: +e.target.value })} /></Field>
                <Field label="Likes (e.g. 12.4K)"><input className={inp} value={editing.likes} onChange={e => setEditing({ ...editing, likes: e.target.value })} placeholder="12.4K" /></Field>
              </div>
              <Field label="Quote / Text"><textarea className={inp + " resize-none"} rows={3} value={editing.text} onChange={e => setEditing({ ...editing, text: e.target.value })} placeholder="Short testimonial quote..." /></Field>
              <Field label="Poster Image URL"><input className={inp} value={editing.poster} onChange={e => setEditing({ ...editing, poster: e.target.value })} placeholder="https://..." /></Field>
              <Field label="Video URL"><input className={inp} value={editing.video} onChange={e => setEditing({ ...editing, video: e.target.value })} placeholder="https://..." /></Field>
              <Field label="Order Index"><input className={inp} type="number" value={editing.order_index} onChange={e => setEditing({ ...editing, order_index: +e.target.value })} /></Field>
              <div className="flex gap-3 pt-2">
                <button onClick={close} className="flex-1 py-2.5 rounded-xl text-sm text-white/60 bg-white/5 hover:bg-white/10 transition-all">Cancel</button>
                <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg,#8b5cf6,#22d3ee)" }}>
                  <Save className="w-4 h-4" />{saving ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
