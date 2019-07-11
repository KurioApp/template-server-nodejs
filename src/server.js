import express from "express";

const server = express();

server.disable("x-powered-by");
server.get("/ping", (req, res) => res.send("pong"));

export default server;
