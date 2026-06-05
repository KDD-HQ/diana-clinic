import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string(),
    lang: z.enum(['ms', 'en']).default('en'),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const treatments = defineCollection({
  type: 'content',
  schema: z.object({
    // Metadata
    title: z.string().max(70),
    description: z.string().max(165),
    category: z.enum([
      'facial',
      'laser',
      'injectable',
      'skin-booster',
      'scar',
      'pigmentation',
      'anti-aging',
    ]),

    // Hero meta-bar
    sessionDuration: z.string(),
    downtime: z.string(),
    interval: z.string(),
    branches: z.array(z.enum(['bangi', 'senawang'])),

    // Featured image
    heroImage: z.string(),
    heroImageAlt: z.string(),
    heroImageCaption: z.string().optional(),

    // E-E-A-T / authority
    medicallyReviewedBy: z.object({
      name: z.string(),
      credentials: z.string(),
    }),
    lastReviewed: z.coerce.date(),
    datePublished: z.coerce.date(),
    dateModified: z.coerce.date(),

    // Language & alternates
    lang: z.enum(['en', 'ms']).default('en'),
    hreflangPair: z.string().optional(),

    // MedicalProcedure schema fields
    alternateNames: z.array(z.string()).default([]),
    howPerformed: z.string(),
    preparation: z.string().optional(),
    followup: z.string().optional(),

    // Compliance content
    sideEffects: z.string().optional(),
    disclaimer: z.string().optional(),

    // CTA
    ctaText: z.string().default('Book a consultation at Klinik Dr Diana.'),
    ctaWhatsappMessage: z.string().optional(),

    // FAQ — drives both visible block AND FAQPage JSON-LD
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .default([]),

    // Cross-linking
    relatedTreatments: z.array(z.string()).default([]),
    relatedBlogPosts: z.array(z.string()).default([]),

    // Publishing
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, treatments };