import type { User, UserCreate, UserRepository, UserUpdate } from "../interfaces/user.interface";
import { prisma } from "../database/prisma-client";
import bcrypt from "bcrypt";

class UserRepositoryPrisma implements UserRepository {
  async create(data: UserCreate): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.passwordHash, 10);

    const result = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: hashedPassword,
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

  async findById(id: string): Promise<User | null> {
    const result = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return result || null;
  }

  async update(id: string, data: UserUpdate): Promise<User | null> {
    const result = await prisma.user.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return result;
  }
}

export { UserRepositoryPrisma };
