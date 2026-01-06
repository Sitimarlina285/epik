// collections/SocialLinks.ts
import type { CollectionConfig } from "payload";

export const SocialLinks: CollectionConfig = {
  slug: "social_links",
  admin: {
    useAsTitle: "label", // ✅ Gunakan label sebagai title
    defaultColumns: ["label", "type", "url"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
      admin: {
        description:
          'Nama untuk identifikasi link ini (contoh: "TikTok Project A", "Instagram Personal")',
        placeholder: "Contoh: TikTok Parallax Network",
      },
    },
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: "Website", value: "website" },
        { label: "Instagram", value: "instagram" },
        { label: "TikTok", value: "tiktok" },
        { label: "GitHub", value: "github" },
        { label: "LinkedIn", value: "linkedin" },
        { label: "Twitter", value: "twitter" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "url",
      type: "text",
      required: true,
      admin: {
        placeholder: "https://...",
      },
    },
  ],
};
