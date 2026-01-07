// src/components/AllWorksGrid.tsx
"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
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

interface Work {
  id: string;
  title: string;
  short_desc?: string;
  media?: {
    id?: string;
    url: string;
    alt?: string;
  } | null;
  social_links?: Array<{
    type: string;
    url: string;
  }>;
}

interface AllWorksGridProps {
  works?: Work[];
}

/* =========================
   MEDIA ITEM (BLOB SAFE)
========================= */
function WorkItemImage({ work }: { work: Work }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.7]);
  const imageOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.6, 1, 0.6]
  );

  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

  return (
    <motion.div
      ref={containerRef}
      style={{ scale: imageScale, opacity: imageOpacity }}
      className="w-full"
    >
      <div className="bg-gray-800 w-[672px] h-[378px] mx-auto overflow-hidden flex items-center justify-center">
        {work.media?.url ? (
          isVideo(work.media.url) ? (
            <video
              src={work.media.url}
              className="w-full h-full object-cover"
              loop
              muted
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={work.media.url}
              alt={work.media.alt || work.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )
        ) : (
          <div className={`${courier.className} text-gray-500 text-sm`}>
            No media available
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* =========================
   MAIN GRID
========================= */
export default function AllWorksGrid({ works = [] }: AllWorksGridProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeWorkIndex, setActiveWorkIndex] = React.useState(0);

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });

  React.useEffect(() => {
    const unsubscribe = sectionProgress.on("change", (latest) => {
      const index = Math.floor(latest * works.length);
      setActiveWorkIndex(Math.max(0, Math.min(index, works.length - 1)));
    });
    return () => unsubscribe();
  }, [sectionProgress, works.length]);

  if (!works.length) return null;

  const activeWork = works[activeWorkIndex];

  const getSocialIcon = (type: string) =>
    ({
      website: <Globe className="w-4 h-4" />,
      instagram: <Instagram className="w-4 h-4" />,
      github: <Github className="w-4 h-4" />,
      linkedin: <Linkedin className="w-4 h-4" />,
      twitter: <Twitter className="w-4 h-4" />,
    })[type] || <ExternalLink className="w-4 h-4" />;

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-[300vh] bg-black text-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-4 md:px-8">
        {/* LEFT */}
        <div className="hidden md:block md:col-span-3">
          <div className="sticky top-1/2 -translate-y-1/2 pl-16">
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
                {getSocialIcon(link.type)}
                {link.url.replace(/^https?:\/\//, "")}
              </a>
            ))}
          </div>
        </div>

        {/* CENTER */}
        <div className="col-span-12 md:col-span-6 flex flex-col gap-24 py-8 md:-ml-16">
          {works.map((work) => (
            <Link key={work.id} href={`/works/${work.id}`}>
              <WorkItemImage work={work} />
            </Link>
          ))}
        </div>

        {/* RIGHT */}
        <div className="hidden md:block md:col-span-3">
          <div className="sticky top-1/2 -translate-y-1/2 pr-12">
            {activeWork.short_desc && (
              <p
                className={`${courier.className} text-sm leading-relaxed max-w-[220px] ml-auto`}
                style={{ color: "#FF00C3" }}
              >
                {activeWork.short_desc}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
