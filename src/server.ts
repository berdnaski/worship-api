import fastify, { type FastifyInstance } from "fastify";
import { userRoutes } from "./routes/user.routes";
import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

const app: FastifyInstance = fastify();

app.register(jwt, {
  secret: "worshipkey-987654321"
});

app.register(swagger, {
  swagger: {
    info: {
      title: 'My API',
      description: 'API Documentation',
      version: '1.0.0',
    },
    tags: [
      { name: 'users', description: 'User related endpoints' }
    ],
  },
});

app.register(swaggerUi, {
  routePrefix: '/docs', 
});

app.register(userRoutes, {
  prefix: "/"
});

app.listen({
  port: 3333,
}, 
  () => console.log("HTTP server running"),
);
