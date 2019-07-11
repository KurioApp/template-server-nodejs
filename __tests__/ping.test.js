import request from "supertest";
import server from "../src/server";

test("It should respond GET /ping request", async () => {
  const response = await request(server).get("/ping");

  expect(response.statusCode).toBe(200);
  expect(response.text).toBe("pong");
});
