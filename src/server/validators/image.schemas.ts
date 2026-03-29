import { z } from 'zod';

export const imageFormatSchema = z.enum(['png', 'jpeg', 'webp', 'avif']);

export const resizeFitSchema = z.enum([
  'cover',
  'contain',
  'fill',
  'inside',
  'outside',
]);

export const resizeSchema = z
  .object({
    width: z.number().int().positive().max(8000).optional(),
    height: z.number().int().positive().max(8000).optional(),
    fit: resizeFitSchema.default('cover'),
  })
  .refine((v) => v.width !== undefined || v.height !== undefined, {
    message: 'resize.width or resize.height is required',
  });

export const renderImageHtmlSchema = z.object({
  source: z.literal('html'),
  content: z.string().min(1, 'HTML content is required'),
  outputFormat: imageFormatSchema.default('png'),
  quality: z.number().int().min(1).max(100).default(90),
  viewport: z
    .object({
      width: z.number().int().positive().max(4000).default(1200),
      height: z.number().int().positive().max(4000).default(630),
    })
    .default({}),
});

export const transformImageRequestSchema = z.object({
  inputFormat: imageFormatSchema,
  outputFormat: imageFormatSchema,
  quality: z.number().int().min(1).max(100).default(90),
  resize: resizeSchema.optional(),
});

export type RenderImageHtmlRequest = z.infer<typeof renderImageHtmlSchema>;
export type TransformImageRequest = z.infer<typeof transformImageRequestSchema>;
