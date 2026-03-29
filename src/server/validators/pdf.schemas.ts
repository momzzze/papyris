import { z } from 'zod';

export const pdfMergeInputSchema = z.object({
  fileId: z.uuid('fileId must be a valid UUID').optional(),
  storageKey: z.string().min(1).optional(),
});
export const pdfMergeRequestSchema = z.object({
  inputs: z
    .array(pdfMergeInputSchema)
    .min(2, 'At least 2 PDFs are required to merge'),
  outputFilename: z.string().min(1).default('merged.pdf'),
});
export type PdfMergeRequest = z.infer<typeof pdfMergeRequestSchema>;
