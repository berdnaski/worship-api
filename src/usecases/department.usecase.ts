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

  async findAll(userId: string, userRole: 'ADMIN' | 'LEADER' | 'MEMBER'): Promise<DepartmentResponse[]> {
    if (userRole === 'ADMIN' || userRole === 'LEADER') {
      
      return await this.departmentRepository.findAll();
    } else if (userRole === 'MEMBER') {
      
      return await this.userRepository.findDepartmentsByUserId(userId);
    }
    throw new Error("Permission denied");
  }

  async findByDepartment(departmentId: string): Promise<DepartmentResponse | null> {
    const department = await this.departmentRepository.findById(departmentId);
  
    if (!department) {
      throw new Error("Department not found");
    }
  
    return department as DepartmentResponse; 
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

  async addUserToDepartment(departmentId: string, id: string): Promise<void> {
    await this.departmentRepository.addUser(departmentId, id);
  }
  
  async removeUserFromDepartment(departmentId: string, id: string): Promise<void> {
    await this.departmentRepository.removeUser(departmentId, id);
  }
}

export { DepartmentUseCase };
