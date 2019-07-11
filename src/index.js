import logger from "winston";
import server from "./server";

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
logger.configure({
  transports: new logger.transports.Console(),
  format: isDev ? logger.format.simple() : logger.format.json(),
  level: isDev ? 'silly' : 'info',
});

if (isDev) {
  logger.warn('app runs in dev mode');
}

const port = process.env.APP_PORT || 3000;
server.listen(port, () => {
  logger.info(`app runs on port ${port}`);
});
