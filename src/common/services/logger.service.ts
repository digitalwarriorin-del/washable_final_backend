import * as winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),

  transports: [
    new winston.transports.File({
      filename: 'logs/errors/error.log',
      level: 'error',
    }),

    new winston.transports.File({
      filename: 'logs/requests/request.log',
    }),
  ],
});