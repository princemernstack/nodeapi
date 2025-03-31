// middleware/loggerMiddleware.js

const logger = require('../config/logger');

const logRequest = (req, res, next) => {
  const { method, url, body, query, params } = req;

  // Log request details
  logger.info(`Request: ${method} ${url}`, {
    body: body,
    query: query,
    params: params,
  });

  // Capture the original `send` method to log the response
  const originalSend = res.send;
  res.send = (body) => {
    logger.info(`Response: ${method} ${url} - Status: ${res.statusCode}`, {
      responseBody: body,
    });
    originalSend.call(res, body);
  };

  next();
};

module.exports = logRequest;
