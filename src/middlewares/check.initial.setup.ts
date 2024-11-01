import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { UserUseCase } from '../usecases/user.usecase';

async function checkInitialSetup(userUseCase: UserUseCase) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.sub;

    if (!userId) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const user = await userUseCase.findByUser(userId);

    if (!user || !user.initialSetupCompleted) {
      return reply.status(403).send({ message: "Initial setup required before accessing this route." });
    }
  };
}

export { checkInitialSetup };