const { createLogger, transports, format } = require('winston');

const requestLogger = createLogger({
  format: format.json(),
  transports: [
    new transports.File({ filename: 'app.log' }),
  ],
});

const errorLogger = createLogger({
  format: format.json(),
  transports: [
    new transports.File({ filename: 'error.log' }),
  ],
});

module.exports = {
  requestLogger,
  errorLogger,
};
