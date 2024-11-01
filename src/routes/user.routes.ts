import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UserUseCase } from "../usecases/user.usecase";
import type { UserCreate, UserLogin, UserUpdate } from "../interfaces/user.interface";
import { verifyJWT } from "../middlewares/verify-jwt";
import {
  userCreateSchema,
  userLoginSchema,
  userSetupSchema,
  userListResponseSchema,
  userResponseSchema,
  userUpdateSchema
} from "../../src/schema/user.schema"; 

export async function userRoutes(fastify: FastifyInstance) {
  const userUseCase = new UserUseCase(fastify);

  fastify.addHook("onRequest", async (req, reply) => {
    if (req.url === "/register" || req.url === "/login" || req.url === "/setup" || req.url === "/dashboard") return;
    await verifyJWT(req, reply);
  });

  fastify.post<{ Body: UserCreate }>("/register", {
    schema: {
      tags: ['Users'], 
      body: userCreateSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
                initialSetupCompleted: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                departmentId: { type: 'string', nullable: true }
              }
            },
            token: { type: 'string' }
          }
        },
        400: { type: 'object', properties: { message: { type: 'string' } } }
      }
    }
  }, async (req: FastifyRequest<{ Body: UserCreate }>, reply: FastifyReply) => {
    const { name, email, passwordHash, departmentId, role } = req.body;

    try {
      const { user, token } = await userUseCase.create({
        name,
        email,
        passwordHash,
        departmentId,
        role
      });
      
      return reply.send({
        user,
        token
      });
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.post<{ Body: UserLogin }>("/login", {
    schema: {
      tags: ['Users'], 
      body: userLoginSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
                initialSetupCompleted: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            },
            token: { type: 'string' }
          }
        },
        401: { type: 'object', properties: { message: { type: 'string' } } }
      }
    }
  }, async (req: FastifyRequest<{ Body: UserLogin }>, reply: FastifyReply) => {
    const { email, password } = req.body as UserLogin; 
    try {
      const { user, token } = await userUseCase.login({
        email,
        password
      });
  
      return reply.send({ user, token });
    } catch (error) {
      reply.code(401).send();
    }
  });  

  fastify.post<{ Body: { userId: string; role: 'ADMIN' | 'LEADER' | 'MEMBER'; code?: string } }>("/setup", {
    schema: {
      tags: ['Users'], 
      body: userSetupSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            user: { type: 'object' } 
          }
        },
        400: { type: 'object', properties: { message: { type: 'string' } } }
      }
    }
  }, async (req: FastifyRequest<{ Body: { userId: string; role: 'ADMIN' | 'LEADER' | 'MEMBER'; code?: string } }>, reply: FastifyReply) => {
    const { userId, role, code } = req.body;

    try {
      const user = await userUseCase.setup(userId, role, code);
      return reply.status(200).send({ user });
    } catch (error) {
      console.error(error);
      const message = (error as Error).message || 'An unexpected error occurred'; 
      reply.status(400).send({ message });
    }
  });

  fastify.get("/users", {
    schema: {
      tags: ['Users'], 
      security: [
        { bearerAuth: [] }
      ],
      response: {
        200: userListResponseSchema,
        401: { type: 'object', properties: { message: { type: 'string' } } }
      },
    }
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const users = await userUseCase.findAll();
      return reply.send(users);
    } catch (error) {
      reply.code(401).send();
    }
  });

  fastify.get<{ Params: { id: string } }>("/users/:id", {
    schema: {
      tags: ['Users'], 
      security: [
        { bearerAuth: [] }
      ],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      response: {
        200: userResponseSchema,
        404: { type: 'object', properties: { message: { type: 'string' } } },
      }
    }
  }, async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = req.params; 
  
    try {
      const user = await userUseCase.findByUser(id);
      if (!user) {
        return reply.code(404).send({ message: 'User not found' });
      }
      return reply.send({ user });
    } catch (error) {
      console.error(error);
      reply.code(500).send({ message: 'Error retrieving user' });
    }
  });

  fastify.put<{ Body: UserUpdate, Params: { id: string } }>("/users/:id", {
    schema: {
      tags: ['Users'], 
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      body: userUpdateSchema, 
      response: {
        200: userResponseSchema, 
        404: { type: 'object', properties: { message: { type: 'string' } } },
      },
    },
  }, async (req: FastifyRequest<{ Params: { id: string }, Body: UserUpdate }>, reply: FastifyReply) => {
    const { id } = req.params;
    const userUpdates = req.body;
  
    try {
      const updatedUser = await userUseCase.update(id, userUpdates);
      return reply.send(updatedUser);
    } catch (error) {
      const message = (error as Error).message; 
  
      if (message === 'User not found') {
        return reply.code(404).send({ message });
      }
  
      reply.code(500).send({ message: 'Error updating user' });
    }
  });

  fastify.delete<{ Params: { id: string } }>("/users/:id", {
    schema: {
      tags: ['Users'], 
      security: [
        { bearerAuth: [] }
      ],
      response: {
        200: { type: 'string', example: 'User deleted successfully' },
        403: { type: 'object', properties: { message: { type: 'string' } } },
        404: { type: 'object', properties: { message: { type: 'string' } } }
      }
    }
  }, async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = req.params;
    const requesterId = req.user.sub; 
    const requesterRole = req.user.role; 
  
    try {
      await userUseCase.delete(id, requesterId, requesterRole);
      return reply.status(200).send("User deleted successfully");
    } catch (error) {
      const message = (error as Error).message || 'An unexpected error occurred';
      if (message === "Permission denied") {
        return reply.status(403).send({ message });
      }
      if (message === "User not found") {
        return reply.status(404).send({ message });
      }
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });
}
