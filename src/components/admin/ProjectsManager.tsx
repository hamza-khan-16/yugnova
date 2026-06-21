import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Save, X, GripVertical, FolderKanban } from "lucide-react";
import { supabase, type Project } from "@/lib/supabase";
import { adminDeleteRowFn, adminSaveRowFn } from "@/lib/api/adminData.functions";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { toast } from "sonner";

const EMPTY: Omit<Project, "id" | "created_at"> = {
  title: "", category: "", tags: [], description: "", image: "", link: "", order_index: 0,
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

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");

  const fetch = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("projects").select("*").order("order_index");
    if (error) toast.error("Failed to load: " + error.message);
    else setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openNew = () => {
    setIsNew(true);
    setEditing({ ...EMPTY, id: "", order_index: projects.length } as Project);
    setTagsInput("");
  };

  const openEdit = (p: Project) => {
    setIsNew(false);
    setEditing({ ...p });
    setTagsInput((p.tags || []).join(", "));
  };

  const close = () => { setEditing(null); setIsNew(false); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = { ...editing, tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean) };
    try {
      if (isNew) {
        const { id: _id, created_at: _c, ...rest } = payload as any;
        await adminSaveRowFn({ data: { table: "projects", payload: rest } });
        toast.success("Project added!");
      } else {
        const { id, created_at: _c, ...rest } = payload as any;
        await adminSaveRowFn({ data: { table: "projects", id, payload: rest } });
        toast.success("Project updated!");
      }
      close();
      fetch();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save project");
    }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    setDeleting(id);
    try {
      await adminDeleteRowFn({ data: { table: "projects", id } });
      toast.success("Deleted");
      fetch();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete project");
    }
    setDeleting(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FolderKanban className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Projects</h2>
          <span className="text-xs font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{projects.length}</span>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#8b5cf6,#22d3ee)" }}>
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-white/30 text-sm">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 text-white/30 text-sm">No projects yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {projects.map((p) => (
            <motion.div key={p.id} layout className="relative rounded-2xl border border-white/8 bg-white/3 overflow-hidden group">
              <div className="aspect-[16/9] bg-white/5 overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-white">{p.title}</div>
                    <div className="text-xs text-violet-400 mt-0.5">{p.category}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(p.tags || []).map(t => (
                        <span key={t} className="text-[9px] font-mono uppercase text-white/30 border border-white/10 rounded-full px-2 py-0.5">{t}</span>
                      ))}
                    </div>
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
                <p className="text-xs text-white/30 mt-2 line-clamp-2">{p.description}</p>
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
                <h3 className="text-base font-bold text-white">{isNew ? "Add Project" : "Edit Project"}</h3>
                <button onClick={close} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Title"><input className={inp} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Modish" /></Field>
                <Field label="Category"><input className={inp} value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} placeholder="E-Commerce" /></Field>
              </div>
              <Field label="Tags (comma separated)"><input className={inp} value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="Web App, Mobile, AI" /></Field>
              <Field label="Description"><textarea className={inp + " resize-none"} rows={3} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Project description..." /></Field>
              <Field label="Image">
                <MediaUploadField
                  value={editing.image}
                  onChange={(url) => setEditing({ ...editing, image: url })}
                  folder="project-images"
                  accept="image/*"
                  placeholder="https://... or upload"
                />
              </Field>
              <Field label="Project Link"><input className={inp} value={editing.link} onChange={e => setEditing({ ...editing, link: e.target.value })} placeholder="https://..." /></Field>
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
