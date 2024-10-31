import { prisma } from "../database/prisma-client";
import type { Department, DepartmentCreate, DepartmentRepository, DepartmentResponse, DepartmentUpdate } from "../interfaces/department.interface";

class DepartmentRepositoryPrisma implements DepartmentRepository {
  async create(data: DepartmentCreate): Promise<Department> {
    return await prisma.department.create({
      data,
    });
  }

  async update(id: string, data: DepartmentUpdate): Promise<Department | null> {
    return await prisma.department.update({
      where: { id },
      data,
    });
  }

  async findById(id: string): Promise<Department | null> {
    return await prisma.department.findUnique({
      where: {
        id,
      }
    })
  }

  async findAll(): Promise<DepartmentResponse[]> {
    return await prisma.department.findMany();
  }

  async delete(departmentId: string): Promise<void> {
    await prisma.department.delete({
      where: {
        id: departmentId,
      }
    });
  }

  async addUser(departmentId: string, id: string): Promise<void> {
    await prisma.department.update({
      where: { id: departmentId },
      data: {
        users: {
          connect: { id }
        },
      },
    });
  }
  

  async removeUser(departmentId: string, id: string): Promise<void> {
    await prisma.department.update({
      where: { id: departmentId },
      data: {
        users: {
          disconnect: { id }
        },
      },
    })
  }
}

export { DepartmentRepositoryPrisma }