import { glob } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";

const fragments = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/data/fragments" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.date(),
    description: z.string().optional(),
    embeds: z.union([z.string(), z.array(z.string())]).optional(),
  }),
});

export const collections = { fragments };
