import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '#/server/lib/env';
import * as schema from '#/server/db/schema';

const sql = postgres(env.DATABASE_URL, { prepare: false });
export const db = drizzle(sql, { schema });
export type DB = typeof db;
