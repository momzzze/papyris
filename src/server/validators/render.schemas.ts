import { z } from 'zod';

export const pdfFormatSchema = z.enum(['A4', 'A3', 'A5', 'Letter', 'Legal']);

export const pdfOptionsSchema = z.object({
  format: pdfFormatSchema.default('A4'),
  margin: z.string().default('20mm'),
  printBackground: z.boolean().default(true),
});

export const renderPdfHtmlSchema = z.object({
  source: z.literal('html'),
  content: z.string().min(1, 'HTML content is required'),
  options: pdfOptionsSchema.default({}),
});

export const renderPdfMarkdownSchema = z.object({
  source: z.literal('markdown'),
  content: z.string().min(1, 'Markdown content is required'),
  theme: z.string().default('default'),
  options: pdfOptionsSchema.default({}),
});

export const renderPdfRequestSchema = z.discriminatedUnion('source', [
  renderPdfHtmlSchema,
  renderPdfMarkdownSchema,
]);
export type RenderPdfRequest = z.infer<typeof renderPdfRequestSchema>;
