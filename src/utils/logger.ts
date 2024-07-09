import pino from 'pino';

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV === 'production'
      ? {
          target: 'pino-roll',
          options: {
            file: 'my-api.log',
            frequency: 'daily',
            size: '10m',
            mkdir: true,
          },
        }
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
});

export default logger;
