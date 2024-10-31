import type { Schedule } from "@prisma/client";
import type { DepartmentRepository } from "../interfaces/department.interface";
import type { ScheduleCreate, ScheduleResponse, SchedulesRepository } from "../interfaces/schedules.interface";
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

  async findAll(departmentId: string): Promise<ScheduleResponse[]> {
    const department = await this.departmentRepostory.findById(departmentId);
    
    if (!department) {
      throw new Error("Department not found");
    }

    const schedules = await this.schedulesRepository.findAllByDepartment(departmentId);

    const scheduleResponses: ScheduleResponse[] = schedules.map(schedule => ({
      name: schedule.name,
      date: schedule.date,
    }));
  
    return scheduleResponses;
  }
  
}

export { SchedulesUseCase }