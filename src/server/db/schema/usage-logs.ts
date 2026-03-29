import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { users } from './users';
import { apiKeys } from './api-keys';

export const usageLogs = pgTable('usage_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  apiKeyId: uuid('api_key_id').references(() => apiKeys.id, {
    onDelete: 'set null',
  }),
  endpoint: text('endpoint').notNull(),
  statusCode: integer('status_code').notNull(),
  units: integer('units').notNull().default(1),
  durationMs: integer('duration_ms'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
