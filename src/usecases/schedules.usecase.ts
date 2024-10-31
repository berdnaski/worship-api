import type { Schedule } from "@prisma/client";
import type { DepartmentRepository } from "../interfaces/department.interface";
import type { ScheduleCreate, SchedulesRepository } from "../interfaces/schedules.interface";
import { DepartmentRepositoryPrisma } from "../repositories/department.repository";
import { SchedulesRepositoryPrisma } from "../repositories/schedules.repository";

class SchedulesUseCase {
  private schedulesRepository: SchedulesRepository;
  private departmentRepostory: DepartmentRepository;

  constructor() {
    this.schedulesRepository = new SchedulesRepositoryPrisma();
    this.departmentRepostory = new DepartmentRepositoryPrisma();
  }

  async create(data: ScheduleCreate & { departmentId: string }): Promise<Schedule> {
    const department = await this.departmentRepostory.findById(data.departmentId);
  
    if (!department) {
      throw new Error("Department not found");
    }
  
    const schedule = await this.schedulesRepository.create({
      ...data, 
      departmentId: data.departmentId, 
    });
  
    return schedule;
  }
}

export { SchedulesUseCase }