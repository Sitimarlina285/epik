// src/components/WorkDetail.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Solway, Courier_Prime } from "next/font/google";

const solway = Solway({ subsets: ["latin"], weight: ["400", "700"] });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400"] });

interface WorkDetailProps {
  work: any;
}

export default function WorkDetail({ work }: WorkDetailProps) {
  const isVideo = (url: string) => url?.match(/\.(mp4|webm|ogg)$/i);

  // Parse lexical content to HTML
  const parseLexicalToHTML = (content: any): string => {
    if (!content) return "";
    if (typeof content === "string") {
      try {
        const parsed = JSON.parse(content);
        if (parsed.root?.children) {
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
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Header - Large Image */}
      {work.media && (
        <div className="max-w-[1400px] mx-auto px-8 pt-8">
          <div className="w-full h-[700px] relative">
            {isVideo(work.media.url) ? (
              <video
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                autoPlay
                controls
              >
                <source src={work.media.url} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={work.media.url}
                alt={work.title}
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>
      )}

      {/* Main Content - 3 Columns Layout */}
      <div className="max-w-[1400px] mx-auto px-8 py-20">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Labels */}
          <div className="col-span-2 space-y-30">
            {/* Client Label - sejajar dengan Title */}
            <div>
              <h3
                className={`${courier.className} text-gray-500 text-xs uppercase tracking-wider`}
              >
                Client
              </h3>
            </div>

            {/* Overview Label - sejajar dengan content */}
            {work.content && (
              <div>
                <h3
                  className={`${courier.className} text-gray-500 text-xs uppercase tracking-wider`}
                >
                  Overview
                </h3>
              </div>
            )}
          </div>

          {/* Center Column - Title & Content */}
          <div className="col-span-5 space-y-16">
            {/* Large Title - sejajar dengan Client */}
            <div>
              <h1
                className={`${solway.className} text-[60px] leading-none font-normal tracking-tight`}
              >
                {work.title}
              </h1>
            </div>

            {/* Short Description - sejajar dengan Overview */}
            {work.short_desc && (
              <div>
                <div
                  className={`${courier.className} text-white text-sm leading-relaxed`}
                >
                  {work.short_desc
                    .split("\n\n")
                    .map((para: string, idx: number) => (
                      <p key={idx} className="mb-4">
                        {para}
                      </p>
                    ))}
                </div>
              </div>
            )}

            {work.long_desc && (
              <div>
                <div
                  className={`${courier.className} text-white text-sm leading-relaxed prose prose-invert prose-sm max-w-none`}
                  dangerouslySetInnerHTML={{
                    __html: parseLexicalToHTML(work.long_desc),
                  }}
                />
              </div>
            )}

            {/* Content with Stats/Info */}
            {work.content && (
              <div>
                <div
                  className={`${courier.className} text-gray-300 text-base leading-relaxed prose prose-invert prose-lg max-w-none`}
                  dangerouslySetInnerHTML={{
                    __html: parseLexicalToHTML(work.content),
                  }}
                />
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="col-span-5">
            <div className="grid grid-cols-2 gap-8">
              {/* Left side of right column */}
              <div className="space-y-12">
                {work.subtitle && (
                  <div>
                    <h3
                      className={`${courier.className} text-gray-500 text-xs mb-3 uppercase tracking-wider`}
                    >
                      Title
                    </h3>
                    <p className={`${courier.className} text-white text-base`}>
                      {work.subtitle}
                    </p>
                  </div>
                )}

                {work.tags &&
                  Array.isArray(work.tags) &&
                  work.tags.length > 0 && (
                    <div>
                      <h3
                        className={`${courier.className} text-gray-500 text-xs mb-3 uppercase tracking-wider`}
                      >
                        Type
                      </h3>
                      <p
                        className={`${courier.className} text-white text-base`}
                      >
                        {work.tags
                          .map((tag: any) =>
                            typeof tag === "object" ? tag.name : tag
                          )
                          .join(", ")}
                      </p>
                    </div>
                  )}

                {work.social_links &&
                  Array.isArray(work.social_links) &&
                  work.social_links.length > 0 && (
                    <div>
                      <h3
                        className={`${courier.className} text-gray-500 text-xs mb-3 uppercase tracking-wider`}
                      >
                        Deliverables
                      </h3>
                      <div className="space-y-2">
                        {work.social_links.map((link: any, idx: number) => (
                          <p
                            key={idx}
                            className={`${courier.className} text-white text-base`}
                          >
                            {typeof link === "object" && link?.url
                              ? link.url.replace(/^https?:\/\//, "")
                              : "Link"}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Right side of right column */}
              <div className="space-y-12">
                {work.status && (
                  <div>
                    <h3
                      className={`${courier.className} text-gray-500 text-xs mb-3 uppercase tracking-wider`}
                    >
                      Status
                    </h3>
                    <p
                      className={`${courier.className} text-white text-base capitalize`}
                    >
                      {work.status}
                    </p>
                  </div>
                )}

                {work.createdAt && (
                  <div>
                    <h3
                      className={`${courier.className} text-gray-500 text-xs mb-3 uppercase tracking-wider`}
                    >
                      Created
                    </h3>
                    <p className={`${courier.className} text-white text-sm`}>
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

      {/* Footer Navigation */}
      <div className="border-t border-gray-800 mt-20">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <Link
            href="/works"
            className={`${courier.className} text-gray-500 hover:text-white transition-colors text-sm`}
          >
            ← All Works
          </Link>
        </div>
      </div>
    </div>
  );
}
