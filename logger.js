const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  format: format.json(),
  transports: [
    new transports.File({ filename: 'app.log' }),
  ],
});

module.exports = logger;
