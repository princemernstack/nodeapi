const logger = require("../config/logger");

const logRequest = (req, res, next) => {
  const { method, url, body, query, params } = req;

  logger.info(`Request: ${method} ${url}`, {
    body: body,
    query: query,
    params: params,
  });

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
