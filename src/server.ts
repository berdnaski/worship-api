import fastify, { type FastifyInstance } from "fastify";
import { userRoutes } from "./routes/user.routes";
import jwt from "@fastify/jwt";

const app: FastifyInstance = fastify();

app.register(jwt, {
  secret: "worshipkey-987654321"
})

app.register(userRoutes, {
  prefix: "/"
})

app.listen({
  port: 3333,
}, 
  () => console.log("HTTP server running"),
);