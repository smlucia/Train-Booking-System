const { createProxyMiddleware } = require('http-proxy-middleware');
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:14899';

const context =  [
  "/weatherforecast",
  "/api/traveler",
  "api/traveler",
  "api/trains",
  "/api/trains",
  "/api/user",
  "api/traveler",
  "api/user",
  "api/schedules",
  "/api/schedules",
];

module.exports = function(app) {
  const appProxy = createProxyMiddleware(context, {
    target: target,
    secure: false,
    changeOrigin: true,
    headers: {
      Connection: 'Keep-Alive'
    }
  });

  app.use(appProxy);
};
