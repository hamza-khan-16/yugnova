import { useForm } from "react-hook-form";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { SectionLabel } from "./SectionLabel";
import { useSectionStyleImage } from "@/lib/useSectionStyleImage";

type FormData = { name: string; email: string; message: string };

const CONTACT_EMAIL = "hello@yugnova.com";

const inputCls =
  "w-full rounded-lg bg-[color:var(--surface-2)] border border-[color:var(--border-soft)] px-4 py-3.5 text-[14.5px] outline-none focus:border-[color:var(--primary)] transition-all placeholder:text-[color:var(--text-dim)]";

export function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const styleImage = useSectionStyleImage("contact");

  const onSubmit = (data: FormData) => {
    const subject = `New inquiry from ${data.name}`;
    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      "",
      "Message:",
      data.message,
    ].join("\n");

    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Opens the visitor's own email client with the message pre-filled —
    // they just hit send from their inbox, no backend mail service needed.
    window.location.href = mailtoUrl;

    toast.success("Opening your email app — just hit send!");
    reset();
  };

  const info = [
    { icon: Mail, label: "Email", value: "hello@yugnova.com" },
    { icon: Phone, label: "Phone", value: "+1 (234) 567-8900" },
    { icon: MapPin, label: "Location", value: "Remote / Worldwide" },
  ];

  return (
    <section id="contact" className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 -z-10">
        <img src={styleImage ?? "/backgrounds/bg-contact.jpeg"} alt="" className="h-full w-full object-cover object-center" style={{ imageRendering: "auto", filter: "none" }} />
        <div className="absolute inset-0 bg-[#13141d]/40" />
      </div>
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 md:px-12">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left: info */}
          <div>
            <SectionLabel>Contact</SectionLabel>
            <h2 className="font-display mt-4 font-extrabold leading-[1.1] tracking-[-0.02em]"
              style={{ fontSize: "clamp(22px, 4vw, 44px)" }}>
              LET'S BUILD SOMETHING AMAZING TOGETHER
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[color:var(--text-soft)]">
              Have a project in mind? Let's discuss how we can help you achieve your goals.
            </p>

            <div className="mt-9 space-y-5">
              {info.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="h-11 w-11 grid place-items-center rounded-xl bg-[color:var(--surface-2)] shrink-0 text-[color:var(--primary)]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-[color:var(--text-dim)]">{item.label}</div>
                    <div className="mt-0.5 text-[15px] font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-2xl bg-[color:var(--background)] border border-[color:var(--border-strong)] p-6 md:p-8 space-y-4"
            >
              <div>
                <input
                  {...register("name", { required: true })}
                  className={inputCls}
                  placeholder="Your Name"
                />
                {errors.name && <span className="text-xs text-red-400">Required</span>}
              </div>
              <div>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className={inputCls}
                  placeholder="Email Address"
                />
                {errors.email && <span className="text-xs text-red-400">Required</span>}
              </div>
              <div>
                <textarea
                  rows={5}
                  {...register("message", { required: true })}
                  className={inputCls}
                  placeholder="Your Message"
                />
                {errors.message && <span className="text-xs text-red-400">Required</span>}
              </div>
              <button
                className="w-full rounded-lg bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-bold text-[14.5px] px-6 py-4 hover:-translate-y-0.5 transition-all"
              >
                Send Message ↗
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}