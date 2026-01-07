"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Instagram,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
} from "lucide-react";
import { Solway, Courier_Prime } from "next/font/google";

const solway = Solway({ subsets: ["latin"], weight: ["400", "700"] });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400"] });

interface SocialLink {
  id: string;
  type: string;
  url: string;
}

interface Work {
  id: string;
  title: string;
  short_desc?: string;
  media?: {
    url: string;
    alt?: string;
  } | null;
  social_links?: SocialLink[];
}

interface WorksSectionProps {
  works: Work[];
}

/* =======================
   MEDIA
======================= */
function WorkMedia({ work }: { work: Work }) {
  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

  return (
    <motion.div
      initial={{ opacity: 0.6, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ amount: 0.4 }}
      className="w-full"
    >
      <div className="bg-gray-800 w-full max-w-[720px] aspect-video mx-auto overflow-hidden">
        {work.media?.url ? (
          isVideo(work.media.url) ? (
            <video
              src={work.media.url}
              className="w-full h-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={work.media.url}
              alt={work.media.alt || work.title}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No media
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* =======================
   MAIN
======================= */
export default function WorksSection({ works }: WorksSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const onScroll = () => {
      const rect = sectionRef.current!.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, -rect.top / (rect.height - window.innerHeight))
      );
      setActiveIndex(
        Math.min(Math.floor(progress * works.length), works.length - 1)
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [works.length]);

  if (!works.length) return null;

  const activeWork = works[activeIndex] || works[0];

  const icon = (type: string): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
      website: <Globe size={14} />,
      instagram: <Instagram size={14} />,
      github: <Github size={14} />,
      linkedin: <Linkedin size={14} />,
      twitter: <Twitter size={14} />,
    };
    return icons[type] || <ExternalLink size={14} />;
  };

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-[300vh] bg-black text-white"
    >
      {/* TITLE */}
      <div className="pt-16 pb-12 text-center">
        <h1 className={`${solway.className} text-4xl font-bold`}>Our Works</h1>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-12 gap-8 px-8">
        {/* LEFT */}
        <div className="hidden md:block col-span-3">
          <div className="sticky top-1/2 -translate-y-1/2 pl-12 space-y-3">
            <h2 className={`${solway.className} text-2xl font-bold`}>
              {activeWork.title}
            </h2>

            {activeWork.social_links?.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                className={`${courier.className} flex items-center gap-2 text-xs hover:text-pink-400`}
              >
                {icon(link.type)}
                {link.url.replace(/^https?:\/\//, "")}
              </a>
            ))}
          </div>
        </div>

        {/* CENTER */}
        <div className="col-span-12 md:col-span-6 flex flex-col gap-24 md:-mx-8">
          {works.map((work) => (
            <WorkMedia key={work.id} work={work} />
          ))}
        </div>

        {/* RIGHT */}
        <div className="hidden md:block col-span-3">
          <div className="sticky top-1/2 -translate-y-1/2 pr-12">
            {activeWork.short_desc && (
              <p
                className={`${courier.className} text-sm leading-relaxed max-w-[240px] ml-auto`}
                style={{ color: "#FF00C3" }}
              >
                {activeWork.short_desc}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-28 text-center">
        <Link
          href="/works"
          className={`${courier.className} px-8 py-3 border border-white text-xs tracking-widest hover:bg-white hover:text-black transition`}
        >
          ALL WORKS
        </Link>
      </div>
    </section>
  );
}
