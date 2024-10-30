import type { FastifyReply, FastifyRequest } from "fastify";

interface User {
  role: "MEMBER" | "ADMIN" | "LEADER";
}

export function verifyUserRole(...roles: ("MEMBER" | "ADMIN" | "LEADER")[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const user = req.user as User;

    if (!user) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    if (!roles.includes(user.role)) {
      return reply.status(403).send({ message: "Forbidden" });
    }
  }
}