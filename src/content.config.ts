import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    datum: z.date(),
    kategorie: z.enum(['Marketing', 'Business', 'Unternehmertum', 'Strategie', 'Vertrieb']),
    autor: z.string().default('Xperten Insider Redaktion'),
    bild: z.string().optional(),
    bildAlt: z.string().optional(),
    freigabe: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
