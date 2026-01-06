// collections/Works.ts
import { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

// Fungsi untuk generate slug dari title
const formatSlug = (val: string): string => {
  return val
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

export const Works: CollectionConfig = {
  slug: "works",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "status", "createdAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
    },
    {
      name: "title",
      type: "text",
      required: true,
      maxLength: 32,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "URL-friendly version of the title",
      },
      hooks: {
        beforeValidate: [
          ({ data, operation, value }) => {
            if (operation === "create" || !value) {
              if (data?.title) {
                return formatSlug(data.title);
              }
            }
            return value;
          },
        ],
      },
    },
    {
      name: "short_desc",
      type: "textarea",
      maxLength: 300,
      required: true,
    },
    {
      name: "long_desc",
      type: "richText",
      editor: lexicalEditor({}),
    },
    {
      name: "media",
      type: "upload",
      relationTo: "media",
      required: false,
      admin: {
        description: "Upload a new image or select from existing media",
      },
    },
    {
      name: "social_links",
      type: "relationship",
      relationTo: "social_links",
      hasMany: true,
      admin: {
        description: "Add links to GitHub, LinkedIn, etc.",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Archived", value: "archived" },
      ],
    },
  ],
  timestamps: true,
};
