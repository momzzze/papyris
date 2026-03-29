import { LOG_REDACT_PATHS, type LogContext } from '#/helpers/constants';
import pino from 'pino';

const isProd = (process.env.NODE_ENV ?? 'dev') === 'prod';

export const LOG_BASE_CONTEXT: Required<Pick<LogContext, 'service' | 'env'>> = {
  service: 'papyris-api',
  env: process.env.NODE_ENV ?? 'dev',
};

export const logger = pino({
  level: isProd ? 'info' : 'debug',
  base: LOG_BASE_CONTEXT,
  redact: {
    paths: [...LOG_REDACT_PATHS],
    censor: '[REDACTED]',
    remove: false,
  },
  transport: isProd
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:SS',
          ignore: 'pid,hostname',
          singleLine: false,
        },
      },
});

export function withContext(context: LogContext) {
  return logger.child(context);
}
