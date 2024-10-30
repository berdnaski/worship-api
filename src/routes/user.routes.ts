import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UserUseCase } from "../usecases/user.usecase";
import type { UserCreate, UserLogin } from "../interfaces/user.interface";
import { verifyJWT } from "../middlewares/verify-jwt";

export async function userRoutes(fastify: FastifyInstance) {
  const userUseCase = new UserUseCase(fastify);

  fastify.addHook("onRequest", async (req, reply) => {
    if (req.url === "/" || req.url === "/login") return;
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
  })
}