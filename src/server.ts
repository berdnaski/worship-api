import fastify, { type FastifyInstance } from "fastify";

const app: FastifyInstance = fastify();

app.listen({
  port: 3333,
}, 
  () => console.log("HTTP server running"),
);