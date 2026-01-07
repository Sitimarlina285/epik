"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Solway, Courier_Prime } from "next/font/google";

const solway = Solway({ subsets: ["latin"], weight: ["400", "700"] });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400"] });

/* =======================
   TYPES
======================= */
interface SocialLink {
  id: string;
  type: string;
  icon?: string | null;
  url: string;
}

interface Work {
  id: string;
  title: string;
  subtitle?: string;
  short_desc?: string;
  long_desc?: any;
  slug?: string;
  status: string;
  media?: {
    id: string;
    url: string;
    alt: string;
  } | null;
  social_links?: Array<SocialLink | string>;
  tags?: Array<{
    id: string;
    name: string;
  }>;
}

interface WorksSectionProps {
  works: Work[];
}

/* =======================
   IMAGE / VIDEO ITEM
======================= */
function WorkItemImage({ work }: { work: Work }) {
  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0.6, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="bg-gray-800 overflow-hidden w-full max-w-[720px] aspect-video mx-auto relative">
        {work.media?.url ? (
          isVideo(work.media.url) ? (
            <video
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
              autoPlay
            >
              <source src={work.media.url} />
            </video>
          ) : (
            <img
              src={work.media.url}
              alt={work.media.alt || work.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )
        ) : (
          <div
            className={`${courier.className} w-full h-full flex items-center justify-center text-gray-500 text-sm`}
          >
            ⚠️ No media available
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* =======================
   MAIN SECTION
======================= */
export default function WorksSection({ works }: WorksSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeWorkIndex, setActiveWorkIndex] = useState(0);

  useEffect(() => {
    if (!sectionRef.current || works.length === 0) return;

    const handleScroll = () => {
      const rect = sectionRef.current!.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollTop = -rect.top;

      const scrollProgress = Math.max(
        0,
        Math.min(1, scrollTop / (rect.height - windowHeight))
      );

      const count = Math.min(works.length, 3);
      const index = Math.floor(scrollProgress * count);
      setActiveWorkIndex(Math.min(index, count - 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [works]);

  /* =======================
     EMPTY STATE
  ======================= */
  if (!works || works.length === 0) {
    return (
      <section className="w-full min-h-screen bg-black text-white flex items-center justify-center">
        <p className={`${courier.className} text-gray-400`}>
          No works available yet.
        </p>
      </section>
    );
  }

  const featuredWorks = works.slice(0, 3);

  return (
    <section
      id="works"
      ref={sectionRef}
      className="w-full min-h-[250vh] bg-black text-white"
    >
      {/* HEADER */}
      <div className="pt-16 pb-10 text-center">
        <h1
          className={`${solway.className} text-3xl sm:text-4xl md:text-5xl font-bold`}
        >
          Our Works
        </h1>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col items-center gap-14 px-4">
        {featuredWorks.map((work) => (
          <WorkItemImage key={work.id} work={work} />
        ))}

        {/* CTA */}
        <Link
          href="/works"
          className={`${courier.className} mt-10 px-8 py-3 border-2 border-white text-xs tracking-widest hover:bg-white hover:text-black transition`}
        >
          ALL WORKS
        </Link>
      </div>
    </section>
  );
}
