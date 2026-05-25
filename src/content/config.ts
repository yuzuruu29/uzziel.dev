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
      status: z.enum(['live', 'in-progress', 'archived']),
      order: z.number(),
      featured: z.boolean().default(false),
    }),
  }),
};
