import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  PORT: z.string().default('3000'),
  APP_URL: z.string().url().default('http://localhost:3000'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
