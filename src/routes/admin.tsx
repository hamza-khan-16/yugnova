import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — YUGNOVA" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    isAdminLoggedIn().then(setAuthed);
  }, []);

  // Avoid flash during hydration
  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#08080a" }}>
        <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster theme="dark" position="bottom-right" richColors />
      {authed ? (
        <AdminPanel />
      ) : (
        <AdminLogin onSuccess={() => setAuthed(true)} />
      )}
    </>
  );
}
