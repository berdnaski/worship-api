import { prisma } from "../database/prisma-client";
import type { Department, DepartmentCreate, DepartmentRepository, DepartmentUpdate } from "../interfaces/department.interface";

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
}

export { DepartmentRepositoryPrisma }