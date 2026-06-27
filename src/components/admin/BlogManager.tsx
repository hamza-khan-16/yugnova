import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Save, X, Newspaper } from "lucide-react";
import { supabase, type Blog } from "@/lib/supabase";
import { adminDeleteRowFn, adminSaveRowFn } from "@/lib/api/adminData.functions";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { toast } from "sonner";

const todayIso = () => new Date().toISOString().slice(0, 10);

const EMPTY: Omit<Blog, "id" | "created_at"> = {
  title: "", excerpt: "", content: "", cover_image: "", author: "Admin", published_at: todayIso(), order_index: 0,
};

const inp = "w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all placeholder-white/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono tracking-widest uppercase text-white/40 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export function BlogManager() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("blogs").select("*").order("order_index");
    if (error) toast.error("Failed to load: " + error.message);
    else setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openNew = () => {
    setIsNew(true);
    setEditing({ ...EMPTY, id: "", order_index: posts.length } as Blog);
  };

  const openEdit = (p: Blog) => {
    setIsNew(false);
    setEditing({ ...p });
  };

  const close = () => { setEditing(null); setIsNew(false); };

  const save = async () => {
    if (!editing) return;
    if (!editing.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      if (isNew) {
        const { id: _id, created_at: _c, ...rest } = editing as any;
        await adminSaveRowFn({ data: { table: "blogs", payload: rest } });
        toast.success("Blog post added!");
      } else {
        const { id, created_at: _c, ...rest } = editing as any;
        await adminSaveRowFn({ data: { table: "blogs", id, payload: rest } });
        toast.success("Blog post updated!");
      }
      close();
      fetch();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save blog post");
    }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    setDeleting(id);
    try {
      await adminDeleteRowFn({ data: { table: "blogs", id } });
      toast.success("Deleted");
      fetch();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete blog post");
    }
    setDeleting(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Newspaper className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">Blog</h2>
          <span className="text-xs font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{posts.length}</span>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#8b5cf6,#22d3ee)" }}>
          <Plus className="w-4 h-4" /> Add Blog Post
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-white/30 text-sm">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-white/30 text-sm">No blog posts yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {posts.map((p) => (
            <motion.div key={p.id} layout className="relative rounded-2xl border border-white/8 bg-white/3 overflow-hidden group">
              <div className="aspect-[16/9] bg-white/5 overflow-hidden">
                {p.cover_image ? (
                  <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <div className="w-full h-full grid place-items-center text-white/15 text-xs font-mono">No cover image</div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white">{p.title}</div>
                    <div className="text-xs text-amber-400 mt-0.5">{p.published_at} · {p.author}</div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(p)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-violet-500/20 text-white/40 hover:text-violet-400 transition-all">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => del(p.id)} disabled={deleting === p.id} className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-white/30 mt-2 line-clamp-2">{p.excerpt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
            <motion.div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 p-6 space-y-4"
              style={{ background: "#0e0e12" }}
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{isNew ? "Add Blog Post" : "Edit Blog Post"}</h3>
                <button onClick={close} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <Field label="Title"><input className={inp} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="How to Build Scalable Web Applications" /></Field>
              <Field label="Excerpt"><textarea className={inp + " resize-none"} rows={2} value={editing.excerpt} onChange={e => setEditing({ ...editing, excerpt: e.target.value })} placeholder="Short summary shown on the blog card..." /></Field>
              <Field label="Content"><textarea className={inp + " resize-none"} rows={8} value={editing.content} onChange={e => setEditing({ ...editing, content: e.target.value })} placeholder="Full post content..." /></Field>
              <Field label="Cover Image">
                <MediaUploadField
                  value={editing.cover_image}
                  onChange={(url) => setEditing({ ...editing, cover_image: url })}
                  folder="blog-images"
                  accept="image/*"
                  placeholder="https://... or upload"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Author"><input className={inp} value={editing.author} onChange={e => setEditing({ ...editing, author: e.target.value })} placeholder="Admin" /></Field>
                <Field label="Published Date"><input className={inp} type="date" value={editing.published_at} onChange={e => setEditing({ ...editing, published_at: e.target.value })} /></Field>
              </div>
              <Field label="Order Index"><input className={inp} type="number" value={editing.order_index} onChange={e => setEditing({ ...editing, order_index: +e.target.value })} /></Field>

              <div className="flex gap-3 pt-2">
                <button onClick={close} className="flex-1 py-2.5 rounded-xl text-sm text-white/60 bg-white/5 hover:bg-white/10 transition-all">Cancel</button>
                <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
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
