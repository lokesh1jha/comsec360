import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      const metaInfo = meta ? JSON.stringify(meta, null, 2) : '';
      return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaInfo}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const metaInfo = meta ? JSON.stringify(meta, null, 2) : '';
          return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaInfo}`;
        })
      ),
    }),
  ],
});

export default logger;
