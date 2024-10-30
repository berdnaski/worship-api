import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UserUseCase } from "../usecases/user.usecase";
import type { UserCreate, UserLogin } from "../interfaces/user.interface";
import { verifyJWT } from "../middlewares/verify-jwt";

export async function userRoutes(fastify: FastifyInstance) {
  const userUseCase = new UserUseCase(fastify);

  fastify.addHook("onRequest", async (req, reply) => {
    if (req.url === "/" || req.url === "/login" || req.url === "/setup") return;
    await verifyJWT(req, reply);
  })

  fastify.post<{ Body: UserCreate}>("/", async (req: FastifyRequest<{ Body: UserCreate}>, reply: FastifyReply) => {
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

  fastify.post<{ Body: UserLogin }>("/login", async (req: FastifyRequest<{ Body: UserLogin}>, reply: FastifyReply) => {
    const { email, password } = req.body;

    try {
      const { user, token } = await userUseCase.login({
        email,
        password
      })

      return reply.send({ user, token });
    } catch (error) {
      reply.code(401).send();
    }
  });

  fastify.post<{ Body: { userId: string; role: 'ADMIN' | 'LEADER' | 'MEMBER'; code?: string } }>("/setup", async (req: FastifyRequest<{ Body: { userId: string; role: 'ADMIN' | 'LEADER' | 'MEMBER'; code?: string } }>, reply: FastifyReply) => {
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
  
}