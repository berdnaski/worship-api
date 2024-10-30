import type { FastifyInstance } from "fastify";
import type { User, UserCreate, UserRepository } from "../interfaces/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class UserUseCase {
  private userRepository: UserRepository;
  private fastify: FastifyInstance;
  constructor(fastify: FastifyInstance) {
    this.userRepository = new UserRepositoryPrisma();
    this.fastify = fastify;
  }

  async create({ name, email, passwordHash, departmentId, role }: UserCreate): Promise<{ user: User; token: string }> {
    const verifyIfUserExists = await this.userRepository.findByEmail(email);

    if (verifyIfUserExists) {
      throw new Error("User already exists");
    }

    const user = await this.userRepository.create({
      name,
      email,
      passwordHash,
      departmentId,
      role,
    });

    const token = this.fastify.jwt.sign({
      sub: user.id,
      role: user.role
    });

    return { user, token }
  }
}

export { UserUseCase };