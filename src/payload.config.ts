import { buildConfig } from "payload";
import path from "path";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"; // ← Ganti import

// Collections
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Works } from "./collections/Works";
import { SocialLinks } from "./collections/SocialLinks";

// Globals
import { Recognition } from "./globals/Recognition";

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,

  collections: [Users, Media, Works, SocialLinks],

  globals: [Recognition],

  cors: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_SERVER_URL || "",
  ].filter(Boolean),

  csrf: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_SERVER_URL || "",
  ].filter(Boolean),

  db: mongooseAdapter({
    url: process.env.DATABASE_URI!,
  }),

  editor: lexicalEditor({}),

  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },

  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",

  // ✅ Plugin Vercel Blob Storage
  plugins: [
    vercelBlobStorage({
      enabled: true, // Optional - default true
      collections: {
        media: true, // Enable untuk collection media
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "", // Auto-provided oleh Vercel
    }),
  ],
});
