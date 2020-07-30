import express from "express";
import * as prometheus from "./prometheus";

const metricRoute = process.env.PROMETHEUS_PATH || "/metrics";
const server = express();

server.disable("x-powered-by");
server.get("/ping", (req, res) => res.send("pong"));
server.use(
  prometheus.middleware({
    excludedRoutes: ["/ping", metricRoute]
  })
);

export default server;
