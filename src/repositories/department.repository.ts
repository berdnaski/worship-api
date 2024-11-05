import { prisma } from "../database/prisma-client";
import type { Department, DepartmentCreate, DepartmentRepository, DepartmentResponse, DepartmentUpdate } from "../interfaces/department.interface";

class DepartmentRepositoryPrisma implements DepartmentRepository {
  async create(data: DepartmentCreate): Promise<DepartmentResponse> {
    const department = await prisma.department.create({
      data,
      include: {
        users: true, 
      },
    });
  
    return department;
  }
  
  async update(id: string, data: DepartmentUpdate): Promise<DepartmentResponse | null> {
    const updatedDepartment = await prisma.department.update({
      where: { id },
      data,
      include: {
        users: true, 
      },
    });
  
    return updatedDepartment;
  }

  async findById(id: string): Promise<DepartmentResponse | null> {
    const department = await prisma.department.findUnique({
      where: {
        id,
      },
      include: {
        users: true,
      },
    });
    
    if (!department) {
      return null; 
    }
  
    return department; 
  }
  
  async findAll(): Promise<DepartmentResponse[]> {
    const departments = await prisma.department.findMany({
      include: {
        users: true, 
      },
    });
  
    return departments;
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
          connect: { id },
        },
      },
    });
  }

  async removeUser(departmentId: string, id: string): Promise<void> {
    await prisma.department.update({
      where: { id: departmentId },
      data: {
        users: {
          disconnect: { id },
        },
      },
    });
  }
}

export { DepartmentRepositoryPrisma };
