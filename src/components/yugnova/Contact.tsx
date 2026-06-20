import { useForm } from "react-hook-form";
import { Mail, MessageCircle, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SectionLabel } from "./SectionLabel";

type FormData = { name: string; email: string; phone: string; service: string; message: string };

const inputCls =
  "w-full rounded-xl bg-[color:var(--surface-2)] border border-[color:var(--border-soft)] px-3.5 sm:px-4 py-3 sm:py-3.5 text-[14px] sm:text-[15px] outline-none focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/15 transition-all placeholder:text-[color:var(--text-dim)]";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[color:var(--text-dim)]">{label}</span>
      <div className="mt-1.5 sm:mt-2">{children}</div>
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

const CONTACT_EMAIL = "hamzakhanbsc16@gmail.com";

function buildMailto(data: FormData) {
  const subject = `New project inquiry from ${data.name}`;
  const body = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    `Service: ${data.service}`,
    "",
    "Message:",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [sending, setSending] = useState(false);

  const onSubmit = async (data: FormData) => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 500));
    window.location.href = buildMailto(data);
    toast.success("Opening your email app with the message pre-filled…");
    reset();
    setSending(false);
  };

  const info = [
    { icon: Mail, label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    { icon: MessageCircle, label: "WhatsApp", value: "+91 9321749200", href: "https://wa.me/9321749200" },
    { icon: MapPin, label: "Location", value: "Mumbai · Remote-first" },
    { icon: Clock, label: "Response time", value: "Within 24 hours" },
  ];

  return (
    <section id="contact" className="relative py-20 md:py-28 lg:py-32 bg-[color:var(--surface)] overflow-hidden">
      <div className="absolute -top-52 -right-52 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,71,171,0.10), transparent 70%)" }} />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 md:px-12">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-20 items-start">

          {/* Left: info */}
          <div className="pt-0 lg:pt-5">
            <SectionLabel>Get In Touch</SectionLabel>
            <h2 className="font-display mt-5 sm:mt-6 font-extrabold leading-[1] tracking-[-0.03em]"
              style={{ fontSize: "clamp(30px, 5vw, 72px)" }}>
              Let's build <span className="gradient-text">something</span> remarkable
            </h2>
            <p className="mt-5 sm:mt-8 text-[14px] sm:text-[15px] md:text-[17px] leading-[1.7] text-[color:var(--text-soft)]">
              Tell us about your project. We reply to every serious inquiry within one business day with thoughts, timelines, and next steps.
            </p>

            {/* Info cards — 2 col on mobile, 1 col on desktop */}
            <div className="mt-7 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {info.map((item) => {
                const cardCls =
                  "flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[color:var(--background)] border border-[color:var(--border-soft)] hover:border-[color:var(--primary)] hover:translate-x-1 transition-all";
                const content = (
                  <>
                    <div className="h-9 w-9 sm:h-11 sm:w-11 grid place-items-center rounded-lg sm:rounded-xl bg-[color:var(--surface-2)] border border-[color:var(--border-strong)] shrink-0">
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-[color:var(--primary)]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.1em] uppercase text-[color:var(--text-dim)]">{item.label}</div>
                      <div className="mt-0.5 text-[13px] sm:text-[15px] font-medium truncate">{item.value}</div>
                    </div>
                  </>
                );
                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={cardCls}
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.label} className={cardCls}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl sm:rounded-[28px] bg-[color:var(--background)] border border-[color:var(--border-strong)] p-5 sm:p-7 md:p-10 lg:p-12 backdrop-blur-xl space-y-4 sm:space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <Field label="Name" error={errors.name?.message}>
                <input {...register("name", { required: "Required" })} className={inputCls} placeholder="Your full name" />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input {...register("email", { required: "Required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} className={inputCls} placeholder="you@company.com" />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <Field label="Phone">
                <input {...register("phone")} className={inputCls} placeholder="+91 98765 43210" />
              </Field>
              <Field label="Service" error={errors.service?.message}>
                <select {...register("service", { required: "Required" })} className={inputCls}>
                  <option value="">Select a service</option>
                  <option>AI Solutions</option>
                  <option>Web Development</option>
                  <option>Mobile Apps</option>
                  <option>UI/UX Design</option>
                  <option>Cybersecurity</option>
                  <option>Cloud & DevOps</option>
                </select>
              </Field>
            </div>

            <Field label="Message" error={errors.message?.message}>
              <textarea
                {...register("message", { required: "Required", minLength: { value: 10, message: "Tell us a bit more" } })}
                rows={5}
                className={inputCls}
                placeholder="Tell us about your project, timeline, and goals…"
              />
            </Field>

            <button
              disabled={sending}
              className="w-full rounded-full gradient-bg text-white font-display text-[15px] sm:text-base font-bold tracking-tight px-6 py-3.5 sm:py-4 hover:-translate-y-0.5 hover:glow-primary transition-all disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send Message →"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}