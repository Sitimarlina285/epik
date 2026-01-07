"use client";

import React from "react";
import Link from "next/link";
import { Solway, Courier_Prime } from "next/font/google";

const solway = Solway({ subsets: ["latin"], weight: ["400", "700"] });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400"] });

interface WorkDetailProps {
  work: any;
}

export default function WorkDetail({ work }: WorkDetailProps) {
  const isVideo = (url?: string) => {
    if (!url) return false;
    return /\.(mp4|webm|ogg)$/i.test(url);
  };

  const parseLexicalToHTML = (content: any): string => {
    if (!content) return "";
    if (typeof content === "string") {
      try {
        const parsed = JSON.parse(content);
        if (parsed?.root?.children) {
          return parsed.root.children
            .map((node: any) => {
              if (node.children) {
                const text = node.children
                  .map((child: any) => child.text || "")
                  .join("");
                return `<p>${text}</p>`;
              }
              return "";
            })
            .join("");
        }
      } catch {
        return content;
      }
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ===== HEADER MEDIA (BLOB SAFE) ===== */}
      {work?.media?.url && (
        <div className="max-w-[1400px] mx-auto px-8 pt-8">
          <div className="w-full h-[700px] overflow-hidden">
            {isVideo(work.media.url) ? (
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls
              >
                <source src={work.media.url} />
              </video>
            ) : (
              <img
                src={work.media.url}
                alt={work.media.alt || work.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-[1400px] mx-auto px-8 py-20">
        <div className="grid grid-cols-12 gap-8">
          {/* LEFT LABELS */}
          <div className="col-span-2 space-y-24">
            <h3
              className={`${courier.className} text-gray-500 text-xs uppercase`}
            >
              Client
            </h3>

            {(work.short_desc || work.long_desc) && (
              <h3
                className={`${courier.className} text-gray-500 text-xs uppercase`}
              >
                Overview
              </h3>
            )}
          </div>

          {/* CENTER CONTENT */}
          <div className="col-span-5 space-y-16">
            <h1
              className={`${solway.className} text-[60px] leading-none tracking-tight`}
            >
              {work.title}
            </h1>

            {work.short_desc && (
              <div className={`${courier.className} text-sm leading-relaxed`}>
                {work.short_desc.split("\n").map((p: string, i: number) => (
                  <p key={i} className="mb-4">
                    {p}
                  </p>
                ))}
              </div>
            )}

            {work.long_desc && (
              <div
                className={`${courier.className} prose prose-invert max-w-none`}
                dangerouslySetInnerHTML={{
                  __html: parseLexicalToHTML(work.long_desc),
                }}
              />
            )}
          </div>

          {/* RIGHT DETAILS */}
          <div className="col-span-5">
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-12">
                {work.subtitle && (
                  <div>
                    <h3
                      className={`${courier.className} text-xs text-gray-500 uppercase mb-2`}
                    >
                      Title
                    </h3>
                    <p className={`${courier.className}`}>{work.subtitle}</p>
                  </div>
                )}

                {Array.isArray(work.tags) && work.tags.length > 0 && (
                  <div>
                    <h3
                      className={`${courier.className} text-xs text-gray-500 uppercase mb-2`}
                    >
                      Type
                    </h3>
                    <p className={`${courier.className}`}>
                      {work.tags
                        .map((t: any) => (typeof t === "object" ? t.name : t))
                        .join(", ")}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-12">
                {work.status && (
                  <div>
                    <h3
                      className={`${courier.className} text-xs text-gray-500 uppercase mb-2`}
                    >
                      Status
                    </h3>
                    <p className="capitalize">{work.status}</p>
                  </div>
                )}

                {work.createdAt && (
                  <div>
                    <h3
                      className={`${courier.className} text-xs text-gray-500 uppercase mb-2`}
                    >
                      Created
                    </h3>
                    <p className={`${courier.className} text-sm`}>
                      {new Date(work.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="border-t border-gray-800">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <Link
            href="/works"
            className={`${courier.className} text-gray-500 hover:text-white text-sm`}
          >
            ← All Works
          </Link>
        </div>
      </div>
    </div>
  );
}
