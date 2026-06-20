import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Save, X, BadgeIndianRupee, Star } from "lucide-react";
import { supabase, type Plan } from "@/lib/supabase";
import { adminDeleteRowFn, adminSaveRowFn } from "@/lib/api/adminData.functions";
import { toast } from "sonner";

const EMPTY: Omit<Plan, "id" | "created_at"> = {
  name: "", price: 0, currency: "₹", period: "/project",
  description: "", features: [], is_popular: false, order_index: 0,
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

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN").format(price);
}

export function PlansManager() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [featuresInput, setFeaturesInput] = useState("");

  const fetch = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("plans").select("*").order("order_index");
    if (error) toast.error("Failed to load plans: " + error.message);
    else setPlans(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openNew = () => {
    setIsNew(true);
    setEditing({ ...EMPTY, id: "", order_index: plans.length } as Plan);
    setFeaturesInput("");
  };

  const openEdit = (p: Plan) => {
    setIsNew(false);
    setEditing({ ...p });
    setFeaturesInput((p.features || []).join("\n"));
  };

  const close = () => { setEditing(null); setIsNew(false); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = { ...editing, features: featuresInput.split("\n").map(f => f.trim()).filter(Boolean) };
    try {
      if (isNew) {
        const { id: _id, created_at: _c, ...rest } = payload as any;
        await adminSaveRowFn({ data: { table: "plans", payload: rest } });
        toast.success("Plan added!");
      } else {
        const { id, created_at: _c, ...rest } = payload as any;
        await adminSaveRowFn({ data: { table: "plans", id, payload: rest } });
        toast.success("Plan updated!");
      }
      close();
      fetch();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save plan");
    }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    setDeleting(id);
    try {
      await adminDeleteRowFn({ data: { table: "plans", id } });
      toast.success("Deleted");
      fetch();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete plan");
    }
    setDeleting(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BadgeIndianRupee className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Plans & Pricing</h2>
          <span className="text-xs font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{plans.length}</span>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#8b5cf6,#22d3ee)" }}>
          <Plus className="w-4 h-4" /> Add Plan
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-white/30 text-sm">Loading...</div>
      ) : plans.length === 0 ? (
        <div className="text-center py-16 text-white/30 text-sm">
          No plans yet. Add your service pricing plans here.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((p) => (
            <motion.div key={p.id} layout
              className="relative rounded-2xl border p-5 group"
              style={{
                background: p.is_popular ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.03)",
                borderColor: p.is_popular ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)",
              }}>
              {p.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#8b5cf6,#22d3ee)" }}>
                  <Star className="w-3 h-3 fill-white" /> POPULAR
                </div>
              )}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="text-sm font-bold text-white">{p.name}</div>
                  <div className="text-2xl font-extrabold text-white mt-1">
                    {p.currency}{formatPrice(p.price)}
                    <span className="text-xs font-normal text-white/30 ml-1">{p.period}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => openEdit(p)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-violet-500/20 text-white/40 hover:text-violet-400 transition-all">
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button onClick={() => del(p.id)} disabled={deleting === p.id} className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-white/40 mb-3">{p.description}</p>
              <ul className="space-y-1">
                {(p.features || []).slice(0, 4).map((f, i) => (
                  <li key={i} className="text-xs text-white/50 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-violet-400 flex-shrink-0" />{f}
                  </li>
                ))}
                {(p.features || []).length > 4 && (
                  <li className="text-xs text-white/30">+{p.features.length - 4} more features</li>
                )}
              </ul>
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
                <h3 className="text-base font-bold text-white">{isNew ? "Add Plan" : "Edit Plan"}</h3>
                <button onClick={close} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <Field label="Plan Name"><input className={inp} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Web Development" /></Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Currency"><input className={inp} value={editing.currency} onChange={e => setEditing({ ...editing, currency: e.target.value })} placeholder="₹" /></Field>
                <Field label="Price"><input className={inp} type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: +e.target.value })} placeholder="49999" /></Field>
                <Field label="Period"><input className={inp} value={editing.period} onChange={e => setEditing({ ...editing, period: e.target.value })} placeholder="/project" /></Field>
              </div>
              <Field label="Description"><textarea className={inp + " resize-none"} rows={2} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Short plan description..." /></Field>
              <Field label="Features (one per line)"><textarea className={inp + " resize-none"} rows={6} value={featuresInput} onChange={e => setFeaturesInput(e.target.value)} placeholder={"Business Websites & Landing Pages\nCustom Web Applications\nE-Commerce Solutions"} /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Order Index"><input className={inp} type="number" value={editing.order_index} onChange={e => setEditing({ ...editing, order_index: +e.target.value })} /></Field>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div onClick={() => setEditing({ ...editing, is_popular: !editing.is_popular })}
                      className={`w-11 h-6 rounded-full transition-colors relative ${editing.is_popular ? "bg-violet-500" : "bg-white/10"}`}>
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${editing.is_popular ? "translate-x-5" : "translate-x-0.5"}`} />
                    </div>
                    <span className="text-sm text-white/60">Popular</span>
                  </label>
                </div>
              </div>
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
