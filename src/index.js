import logger from "winston";
import server from "./server";

const port = process.env.APP_PORT || 3000;
server.listen(port, () => {
  logger.info(`app runs on port ${port}`);
});
