export const LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];

export type LogContext = {
  requestId?: string;
  userId?: string;
  jobId?: string;
  route?: string;
  service?: string;
  env?: string;
};

export const LOG_REDACT_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'authorization',
  'cookie',
  'password',
  'token',
  'apiKey',
] as const;
