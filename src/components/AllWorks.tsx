// src/components/AllWorksGrid.tsx
"use client";

import React, { useRef } from "react";
import Image from "next/image";
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
  subtitle?: string;
  short_desc?: string;
  media?: {
    id: string;
    url: string;
    alt: string;
  } | null;
  social_links?: Array<{
    type: string;
    icon?: string | null;
    url: string;
  }>;
  tags?: Array<{
    id: string;
    name: string;
  }>;
}

interface AllWorksGridProps {
  works?: any[];
}

function WorkItemImage({ work }: { work: Work }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const isVideo = (url: string) => url?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <motion.div
      ref={containerRef}
      className="w-full"
      style={{ scale: imageScale, opacity: imageOpacity }}
    >
      <div className="bg-gray-800 overflow-hidden w-[672px] h-[378px] flex items-center justify-center relative mx-auto">
        {work.media?.url ? (
          <div className="w-full h-full relative">
            {isVideo(work.media.url) ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                preload="metadata"
                autoPlay
              >
                <source src={work.media.url} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={work.media.url}
                alt={work.media.alt || work.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
        ) : (
          <div className={`${courier.className} text-gray-500 text-center p-4`}>
            <p className="text-lg mb-2">⚠️ No media available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function AllWorksGrid({ works = [] }: AllWorksGridProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeWorkIndex, setActiveWorkIndex] = React.useState(0);

  const { scrollYProgress: headerProgress } = useScroll({
    target: headerRef,
    offset: ["start end", "end start"],
  });

  const headerOpacity = useTransform(headerProgress, [0, 0.2, 0.5], [0, 1, 1]);
  const headerY = useTransform(headerProgress, [0, 0.2], [40, 0]);

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });

  React.useEffect(() => {
    const unsubscribe = sectionProgress.on("change", (latest) => {
      const totalWorks = works.length;
      const index = Math.floor(latest * (totalWorks + 0.5));
      const clampedIndex = Math.max(0, Math.min(index, totalWorks - 1));
      setActiveWorkIndex(clampedIndex);
    });
    return () => unsubscribe();
  }, [sectionProgress, works.length]);

  if (!works || !Array.isArray(works)) {
    return (
      <section className="w-full min-h-screen bg-black text-white flex items-center justify-center">
        <div className={`${courier.className} text-gray-400 text-lg`}>
          Loading works...
        </div>
      </section>
    );
  }

  if (works.length === 0) {
    return (
      <section className="w-full min-h-screen bg-black text-white flex items-center justify-center">
        <div className={`${courier.className} text-gray-400 text-lg`}>
          No works available yet.
        </div>
      </section>
    );
  }

  const activeWork = works[activeWorkIndex];

  const getSocialIcon = (type: string) => {
    const icons = {
      website: <Globe className="w-4 h-4" />,
      instagram: <Instagram className="w-4 h-4" />,
      github: <Github className="w-4 h-4" />,
      linkedin: <Linkedin className="w-4 h-4" />,
      twitter: <Twitter className="w-4 h-4" />,
    };
    return (
      icons[type as keyof typeof icons] || <ExternalLink className="w-4 h-4" />
    );
  };

  return (
    <section
      id="works"
      ref={sectionRef}
      className="w-full min-h-[300vh] bg-black text-white relative"
    >
      <motion.div
        ref={headerRef}
        style={{ opacity: headerOpacity, y: headerY }}
        className="pt-16 pb-8 text-center"
      >
        <h1 className={`${solway.className} text-4xl md:text-5xl font-bold`}>
          {" "}
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-4 md:px-8 relative">
        <div className="hidden md:block md:col-span-3">
          <div className="sticky top-1/2 -translate-y-1/2 pr-4 pl-16">
            <motion.div
              key={`left-${activeWorkIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-2"
            >
              <h2
                className={`${solway.className} text-2xl font-bold text-white`}
              >
                {activeWork.title}
              </h2>

              {activeWork.social_links &&
                activeWork.social_links.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1">
                    {activeWork.social_links.map((link: any, idx: number) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${courier.className} flex items-center gap-2 text-xs text-white hover:text-pink-400 transition-colors`}
                      >
                        {getSocialIcon(link.type)}
                        <span className="text-xs">
                          {link.url.replace(/^https?:\/\//, "")}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
            </motion.div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 flex flex-col gap-2 py-8 md:-ml-16">
          {works.map((work: any) => (
            <Link key={work.id} href={`/works/${work.id}`}>
              <WorkItemImage work={work} />
            </Link>
          ))}
        </div>

        <div className="hidden md:block md:col-span-3">
          <div className="sticky top-1/2 -translate-y-1/2 pl-4">
            <motion.div
              key={`right-${activeWorkIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-2 max-w-[200px] ml-6"
            >
              {activeWork.short_desc && (
                <p
                  className={`${courier.className} text-sm leading-relaxed line-clamp-6`}
                  style={{ color: "#FF00C3" }}
                >
                  {activeWork.short_desc}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
