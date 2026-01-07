import { buildConfig } from "payload";
import path from "path";
import { fileURLToPath } from "url";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";

// Collections
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Works } from "./collections/Works";
import { SocialLinks } from "./collections/SocialLinks";

// Globals
import { Recognition } from "./globals/Recognition";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,

  collections: [Users, Media, Works, SocialLinks],

  globals: [Recognition],

  cors: [
    "http://localhost:3000",
    "https://epik-rho.vercel.app",
    process.env.NEXT_PUBLIC_SERVER_URL || "",
  ].filter(Boolean),

  csrf: [
    "http://localhost:3000",
    "https://epik-rho.vercel.app",
    process.env.NEXT_PUBLIC_SERVER_URL || "",
  ].filter(Boolean),

  db: mongooseAdapter({
    url: process.env.DATABASE_URI!,
  }),

  editor: lexicalEditor({}),

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"), // ← GANTI __dirname dengan dirname
  },

  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",

  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    }),
  ],
});
