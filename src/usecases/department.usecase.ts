import type { Department, DepartmentCreate, DepartmentRepository, DepartmentResponse, DepartmentUpdate } from "../interfaces/department.interface";
import type { UserRepository } from "../interfaces/user.interface";
import { DepartmentRepositoryPrisma } from "../repositories/department.repository";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class DepartmentUseCase {
  private departmentRepository: DepartmentRepository;
  private userRepository: UserRepository;

  constructor() {
    this.departmentRepository = new DepartmentRepositoryPrisma();
    this.userRepository = new UserRepositoryPrisma();
  }

  async create(data: DepartmentCreate, id: string): Promise<DepartmentResponse> {
    const user = await this.userRepository.findById(id);

    if (!user || (user.role !== "LEADER" && user.role !== "ADMIN")) {
      throw new Error("User is not authorized to create a department");
    }

    if (user.departmentId) {
      throw new Error("User is already in a department");
    }
    
    const department = await this.departmentRepository.create(data);

    await this.userRepository.addUserToDepartment(id, department.id);

    return department;
  }

  async update(id: string, data: DepartmentUpdate): Promise<Department | null> {
    const existingDepartment = await this.departmentRepository.findById(id);

    if (!existingDepartment) {
      throw new Error("Department not found");
    }

    const update = await this.departmentRepository.update(id, data);

    return update;
  }

  async findAll(): Promise<DepartmentResponse[]> {
    const departments = await this.departmentRepository.findAll();

    return departments.map(department => ({
      id: department.id,
      name: department.name,
      description: department.description,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
    }));
  }

  async delete(departmentId: string, requesterId: string, requesterRole: 'ADMIN' | 'LEADER'): Promise<void> {
    const departmentToDelete = await this.departmentRepository.findById(departmentId);

    if (!departmentToDelete) {
        throw new Error("Department not found");
    }

    if (requesterRole !== "ADMIN" && requesterRole !== "LEADER" && requesterId !== departmentId) {
        throw new Error("Permission denied");
    }

    await this.departmentRepository.delete(departmentId);
  }

  async findByDepartment(departmentId: string): Promise<Department | null> {
    const department = await this.departmentRepository.findById(departmentId);

    if (!department) {
      throw new Error("Department not found");
    }

    return department;
  }
}

export { DepartmentUseCase };
