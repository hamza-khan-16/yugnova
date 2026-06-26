import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/yugnova/ThemeProvider";
import { Navbar } from "@/components/yugnova/Navbar";
import { Hero } from "@/components/yugnova/Hero";
import { Marquee } from "@/components/yugnova/Marquee";
import { Services } from "@/components/yugnova/Services";
import { About } from "@/components/yugnova/About";
import { Process } from "@/components/yugnova/Process";
import { Projects } from "@/components/yugnova/Projects";
import { Testimonials } from "@/components/yugnova/Testimonials";
import { Reels } from "@/components/yugnova/Reels";
import { Pricing } from "@/components/yugnova/Pricing";
import { Blog } from "@/components/yugnova/Blog";
import { Contact } from "@/components/yugnova/Contact";
import { Footer } from "@/components/yugnova/Footer";
import { Cursor } from "@/components/yugnova/Cursor";
import { WhatsAppButton } from "@/components/yugnova/WhatsAppButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YUGNOVA — We Build Digital Products That Drive Growth" },
      { name: "description", content: "YUGNOVA helps startups and businesses build modern websites, mobile apps, and software solutions focused on quality, performance, and security." },
      { property: "og:title", content: "YUGNOVA — We Build Digital Products That Drive Growth" },
      { property: "og:description", content: "Web Development, Mobile Apps, UI/UX Design, Cybersecurity, Software Development & Branding." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <ThemeProvider>
      <Cursor />
      <Toaster theme="dark" position="bottom-right" />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <About />
        <Process />
        <Projects />
        <Testimonials />
        <Pricing />
        <Reels />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </ThemeProvider>
  );
}
