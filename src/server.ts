import fastify, { type FastifyInstance } from "fastify";
import { userRoutes } from "./routes/user.routes";
import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { departmentRoutes } from "./routes/department.routes";
import { schedulesRoutes } from "./routes/schedules.routes";

const app: FastifyInstance = fastify();

app.register(jwt, {
  secret: "worshipkey-987654321"
});

app.register(swagger, {
  openapi: {
    info: {
      title: 'My API',
      description: 'API Documentation',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
});

app.register(swaggerUi, {
  routePrefix: '/docs',
});

app.register(userRoutes, {
  prefix: "/"
});

app.register(departmentRoutes, {
  prefix: "/"
})

app.register(schedulesRoutes, {
  prefix: "/"
})

app.listen({
  port: 3333,
}, 
  () => console.log("HTTP server running"),
);
