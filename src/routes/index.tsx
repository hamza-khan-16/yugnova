import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/yugnova/ThemeProvider";
import { Navbar } from "@/components/yugnova/Navbar";
import { Hero } from "@/components/yugnova/Hero";
import { Marquee } from "@/components/yugnova/Marquee";
import { About } from "@/components/yugnova/About";
import { Services } from "@/components/yugnova/Services";
import { Process } from "@/components/yugnova/Process";
import { Projects } from "@/components/yugnova/Projects";
import { Testimonials } from "@/components/yugnova/Testimonials";
import { Reels } from "@/components/yugnova/Reels";
import { Contact } from "@/components/yugnova/Contact";
import { Footer } from "@/components/yugnova/Footer";
import { Cursor } from "@/components/yugnova/Cursor";
import { WhatsAppButton } from "@/components/yugnova/WhatsAppButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YUGNOVA — Building the Future" },
      { name: "description", content: "YUGNOVA is a digital innovation studio crafting AI, web, mobile, cloud and security software for ambitious teams." },
      { property: "og:title", content: "YUGNOVA — Building the Future" },
      { property: "og:description", content: "AI, Web, Mobile, Cloud, Security & Design — engineered for outcomes." },
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
        <About />
        <Services />
        <Process />
        <Projects />
        <Testimonials />
        <Reels />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </ThemeProvider>
  );
}
