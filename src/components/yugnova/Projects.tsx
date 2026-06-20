import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { supabase, type Project as DbProject } from "@/lib/supabase";

type Project = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  image: string;
  link: string;
};

const FALLBACK_PROJECTS: Project[] = [
  {
    id: "modish", title: "Modish",
    category: "E-Commerce",
    tags: ["Online Catalog", "Clothing Brand"],
    description: "An online catalog platform for a modern clothing brand with product showcase.",
    image: "/modish.png",
    link: "https://www.modish-now.shop",
  },
  {
    id: "khwaish", title: "Khwaish",
    category: "Event Management",
    tags: ["Web Development", "Event Platform"],
    description: "A comprehensive event management website for organizing various types of events.",
    image: "/khwaish.png",
    link: "https://csckhwaish.rajuprasad.com/",
  },
  {
    id: "bugnexa", title: "BugNexa",
    category: "Security",
    tags: ["Bug Bounty", "Security Platform"],
    description: "An online security-related bug bounty platform for ethical hackers and security researchers.",
    image: "/bugnexa.png",
    link: "https://bugnexa.com",
  },
  {
    id: "techwizard", title: "TechWizard",
    category: "Event Management",
    tags: ["Web Development", "Event Platform"],
    description: "An event managing website for organizing and managing technical events seamlessly.",
    image: "/techwizard.png",
    link: "http://csctechwizard.in/",
  },
  {
    id: "yuvans", title: "Yuvans Tutorials",
    category: "Education",
    tags: ["Mobile App", "Class Management"],
    description: "A class management and study notes sharing application for students and educators.",
    image: "/yt.png",
    link: "https://play.google.com/store/apps/details?id=com.YuvansTutorialsPIS&hl=en_IN",
  },
];

function toProject(p: DbProject): Project {
  return { id: p.id, title: p.title, category: p.category, tags: p.tags, description: p.description, image: p.image, link: p.link };
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("order_index")
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setProjects(data.map(toProject));
        }
      });
  }, []);

  return (
    <section id="projects" className="relative py-20 md:py-28 lg:py-32 bg-[color:var(--surface)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 md:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end justify-between gap-5 sm:gap-8 mb-10 sm:mb-14 md:mb-16">
          <div>
            <SectionLabel>Selected Work</SectionLabel>
            <h2 className="font-display mt-4 sm:mt-6 font-extrabold leading-[1] tracking-[-0.03em]"
              style={{ fontSize: "clamp(32px, 5vw, 72px)" }}>
              Our <span className="gradient-text">projects</span>
            </h2>
          </div>
          <p className="max-w-sm text-[14px] sm:text-[15px] leading-[1.6] text-[color:var(--text-soft)]">
            A curated selection of work built with precision, security, and lasting business value.
          </p>
        </div>

        {/* Grid — 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {projects.map((p, i) => (
            <motion.a
              key={p.id}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group relative flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden bg-[color:var(--background)] border border-[color:var(--border-soft)] hover:border-[color:var(--border-strong)] transition-colors"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[color:var(--surface-2)]">
                <img
                  src={p.image}
                  alt={p.title}
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 font-mono text-[9px] tracking-[0.1em] uppercase bg-[color:var(--primary)] text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
                  {p.category}
                </span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 grid place-items-center"
                  style={{ background: "rgba(10,10,10,0.55)" }}
                >
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.1em] uppercase text-white">
                    View Project <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 sm:p-6 md:p-7">
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[9px] sm:text-[10px] tracking-[0.05em] uppercase text-[color:var(--text-dim)] border border-[color:var(--border-soft)] rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h4 className="font-display text-lg sm:text-xl font-bold">{p.title}</h4>
                <p className="text-[13px] sm:text-sm text-[color:var(--text-soft)] mt-1.5 sm:mt-2 leading-[1.6]">
                  {p.description}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
