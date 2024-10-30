import type { User } from "@prisma/client";
import type { UserCreate, UserRepository } from "../interfaces/user.interface";
import { prisma } from "../database/prisma-client";

class UserRepositoryPrisma implements UserRepository {
  async create(data: UserCreate): Promise<User> {
    const result = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        role: data.role || "MEMBER", 
        departmentId: data.departmentId
      },
    });

    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return result || null;
  }
}

export { UserRepositoryPrisma };
