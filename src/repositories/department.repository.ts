import { prisma } from "../database/prisma-client";
import type { Department, DepartmentCreate, DepartmentRepository } from "../interfaces/department.interface";

class DepartmentRepositoryPrisma implements DepartmentRepository {
  async create(data: DepartmentCreate): Promise<Department> {
    return await prisma.department.create({
      data,
    });
  }
}

export { DepartmentRepositoryPrisma }