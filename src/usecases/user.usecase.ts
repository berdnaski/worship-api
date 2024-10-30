import type { FastifyInstance } from "fastify";
import type { User, UserCreate, UserLogin, UserRepository } from "../interfaces/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repository";
import bcrypt from "bcrypt";

class UserUseCase {
  private userRepository: UserRepository;
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.userRepository = new UserRepositoryPrisma();
    this.fastify = fastify;
  }

  private sanitizeUser(user: User): Omit<User, 'passwordHash'> {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async create({ name, email, passwordHash, departmentId, role }: UserCreate): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
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

    return { user: this.sanitizeUser(user), token };
  }

  async login({ email, password }: UserLogin): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    const token = this.fastify.jwt.sign({
      sub: user.id,
      role: user.role
    });

    return { user: this.sanitizeUser(user), token }; // Use o método sanitizeUser
  }
}

export { UserUseCase };
