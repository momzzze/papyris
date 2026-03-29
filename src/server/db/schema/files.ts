import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const files = pgTable('files', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  storageKey: text('storage_key').notNull().unique(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  checksum: text('checksum').notNull(),
  isPublic: boolean('is_public').notNull().default(false),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
