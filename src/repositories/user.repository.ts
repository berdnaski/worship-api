import type { User, UserCreate, UserRepository, UserResponse, UserUpdate } from "../interfaces/user.interface";
import { prisma } from "../database/prisma-client";
import bcrypt from "bcrypt";
import type { Department } from "@prisma/client";
import type { DepartmentResponse } from "../interfaces/department.interface";

class UserRepositoryPrisma implements UserRepository {
  async create(data: UserCreate): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.passwordHash, 10);

    const result = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: hashedPassword,
        role: data.role || "MEMBER",
        departmentId: data.departmentId,
        avatarUrl: data.avatarUrl 
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
      include: {
        department: true,  
      },
    });
  
    return result || null;
  }

  async update(id: string, data: UserUpdate): Promise<User | null> {
    const result = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        avatarUrl: data.avatarUrl, 
      },
    });

    return result;
  }

  async findAll(): Promise<UserResponse[]> {
    return await prisma.user.findMany();
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: {
        id: id,
      }
    });
  }

  async addUserToDepartment(userId: string, departmentId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        department: {
          connect: { id: departmentId }
        },
      },
    });
  }

  async findDepartmentsByUserId(userId: string): Promise<DepartmentResponse[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        department: {
          include: {
            users: true, 
          },
        },
      },
    });
  
    
    if (!user || !user.department) {
      return []; 
    }
  
    return [{
      ...user.department,
      users: user.department.users ?? [], 
    }];
  }
}

export { UserRepositoryPrisma };
