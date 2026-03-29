import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { files } from './files';

export const jobTypeEnum = pgEnum('job_type', [
  'render_pdf',
  'render_image',
  'transform_image',
  'merge_pdf',
]);

export const jobStatusEnum = pgEnum('job_status', [
  'queued',
  'processing',
  'done',
  'failed',
]);

export const jobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: jobTypeEnum('type').notNull(),
  status: jobStatusEnum('status').notNull().default('queued'),
  inputMeta: jsonb('input_meta').notNull(),
  outputFileId: uuid('output_file_id').references(() => files.id, {
    onDelete: 'set null',
  }),
  errorMessage: text('error_message'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
