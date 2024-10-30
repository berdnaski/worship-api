import type { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWT(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch (error) {
    console.log(error);
    return reply.status(401).send({ message: "Unauthorized" });
  }
}