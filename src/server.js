import express from "express";
import bodyParser from "body-parser";
// import repository from "./repository/repository";
// import service from "./service";
// import MysqlORM from "./repository/mysql";

const server = express();
server.use(bodyParser.json());

// Init repository and service before using the variable inside the handler.
// included template is using Mysql and Sequelize as the ORM.
// const Repo = repository(MysqlORM);
// const Service = service(Repo);

server.disable("x-powered-by");
server.get("/ping", (req, res) => res.send("pong"));

export default server;
