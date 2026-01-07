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
  type: string;
  url: string;
}

interface Work {
  id: string;
  title: string;
  short_desc?: string;
  media?: {
    id: string;
    url: string;
    alt?: string;
  } | null;
  social_links?: SocialLink[];
}

interface WorksSectionProps {
  works: Work[];
}

/* =======================
   IMAGE / VIDEO
======================= */
function WorkItemImage({ work }: { work: Work }) {
  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

  return (
    <motion.div
      initial={{ opacity: 0.6, scale: 0.75 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center"
    >
      <div className="relative w-[672px] h-[378px] bg-gray-800 overflow-hidden">
        {work.media?.url ? (
          isVideo(work.media.url) ? (
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={work.media.url} />
            </video>
          ) : (
            <img
              src={work.media.url}
              alt={work.media.alt || work.title}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div
            className={`${courier.className} w-full h-full flex items-center justify-center text-gray-500`}
          >
            No media
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
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const onScroll = () => {
      const rect = sectionRef.current!.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, -rect.top / (rect.height - window.innerHeight))
      );
      const index = Math.floor(progress * works.length);
      setActiveIndex(Math.min(index, works.length - 1));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [works.length]);

  if (!works.length) return null;

  const activeWork = works[activeIndex];

  const getIcon = (type: string) =>
    ({
      website: <Globe size={14} />,
      instagram: <Instagram size={14} />,
      github: <Github size={14} />,
      linkedin: <Linkedin size={14} />,
      twitter: <Twitter size={14} />,
    })[type] || <ExternalLink size={14} />;

  return (
    <section
      ref={sectionRef}
      id="works"
      className="w-full min-h-[250vh] bg-black text-white"
    >
      <div className="pt-20 pb-12 text-center">
        <h1 className={`${solway.className} text-4xl font-bold`}>Our Works</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 md:px-12">
        {/* ========== LEFT ========== */}
        <div className="hidden md:block md:col-span-3">
          <div className="sticky top-1/2 -translate-y-1/2 pl-12 pr-4">
            <motion.div
              key={`left-${activeIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h2 className={`${solway.className} text-2xl font-bold`}>
                {activeWork.title}
              </h2>

              {activeWork.social_links && (
                <div className="flex flex-col gap-2">
                  {activeWork.social_links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${courier.className} flex items-center gap-2 text-xs hover:text-pink-400`}
                    >
                      {getIcon(link.type)}
                      {link.url.replace(/^https?:\/\//, "")}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* ========== CENTER ========== */}
        <div className="md:col-span-6 flex flex-col gap-24 py-12 md:-ml-12">
          {works.map((work) => (
            <WorkItemImage key={work.id} work={work} />
          ))}

          <Link
            href="/works"
            className={`${courier.className} mx-auto mt-8 px-8 py-3 border-2 border-white hover:bg-white hover:text-black transition`}
          >
            ALL WORKS
          </Link>
        </div>

        {/* ========== RIGHT ========== */}
        <div className="hidden md:block md:col-span-3">
          <div className="sticky top-1/2 -translate-y-1/2 -ml-6 max-w-[220px]">
            <motion.div
              key={`right-${activeIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {activeWork.short_desc && (
                <p
                  className={`${courier.className} text-sm leading-relaxed`}
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
