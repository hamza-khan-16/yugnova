import { useRef, useState } from "react";
import { UploadCloud, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { adminCreateUploadUrlFn } from "@/lib/api/adminUpload.functions";

type Folder = "reel-posters" | "reel-videos" | "project-images" | "blog-images";

const inp =
  "w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all placeholder-white/20";

export function MediaUploadField({
  value,
  onChange,
  folder,
  accept,
  placeholder,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: Folder;
  accept: "image/*" | "video/*";
  placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const { token, path, publicUrl } = await adminCreateUploadUrlFn({
        data: { folder, filename: file.name },
      });

      // Upload straight to Supabase Storage from the browser using the
      // signed token — bypasses our server function entirely, so large
      // video files don't hit any serverless request-size limit.
      const { error } = await supabase.storage
        .from("media")
        .uploadToSignedUrl(path, token, file);

      if (error) throw error;

      onChange(publicUrl);
      toast.success("Uploaded!");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          className={inp}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "https://..."}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 hover:bg-violet-500/20 hover:border-violet-500/40 text-white/60 hover:text-violet-400 transition-all disabled:opacity-50"
          title="Upload from device"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UploadCloud className="w-4 h-4" />
          )}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value && !uploading && (
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/70">
          <Check className="w-3 h-3" /> Media set
        </div>
      )}
    </div>
  );
}
