import { z, defineCollection } from 'astro:content';

export const collections = {
  work: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      role: z.string(),
      year: z.number(),
      stack: z.array(z.string()),
      summary: z.string(),
      cover: z.string(),
      // Real app/game icon, shown beside the title on cards and case studies.
      logo: z.string().optional(),
      status: z.enum(['live', 'completed', 'in-progress', 'archived']),
      order: z.number(),
      featured: z.boolean().default(false),
      highlight: z.boolean().default(false),
    }),
  }),
};
