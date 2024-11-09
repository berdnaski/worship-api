import type { Schedule } from "@prisma/client";
import type { DepartmentRepository } from "../interfaces/department.interface";
import type { ScheduleCreate, ScheduleResponse, SchedulesRepository, ScheduleUpdate, ScheduleWithDetails } from "../interfaces/schedules.interface";
import { DepartmentRepositoryPrisma } from "../repositories/department.repository";
import { SchedulesRepositoryPrisma } from "../repositories/schedules.repository";
import { DateTime } from 'luxon';

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
      id: schedule.id,
      name: schedule.name,
      date: schedule.date,
      departmentId: schedule.departmentId,
      participants: schedule.participants.map(participant => ({
        status: participant.status, 
        user: {  
          id: participant.user.id,
          name: participant.user.name,
          email: participant.user.email,
          avatarUrl: participant.user.avatarUrl
        }
      })),
      songs: schedule.songs.map(song => ({
        id: song.id,
        title: song.title,
        artist: song.artist,
      }))
    }));
  
    return scheduleResponses;
  }
  
  
  async findBySchedule(departmentId: string, scheduleId: string): Promise<ScheduleWithDetails | null> {
    const schedule = await this.schedulesRepository.findByDepartmentAndId(departmentId, scheduleId);
  
    if (!schedule) {
      return null;
    }
  
    return {
      id: schedule.id,
      name: schedule.name,
      date: schedule.date,
      departmentId: schedule.departmentId,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
      participants: schedule.participants,
      songs: schedule.songs,
    };
  }
  
  

  async update(departmentId: string, scheduleId: string, data: ScheduleUpdate): Promise<Schedule | null> {
    const department = await this.departmentRepostory.findById(departmentId); 
    
    if (!department) {
      throw new Error("Department not found");
    }
  
    const schedule = await this.schedulesRepository.findByDepartmentAndId(departmentId, scheduleId);
  
    if (!schedule) {
      throw new Error("Schedule not found");
    }
  
    
    if (data.date && data.time) {
      const date = DateTime.fromISO(data.date.toISOString()); 
      const [hours, minutes] = data.time.split(':'); 
      const updatedDate = date.set({ hour: Number(hours), minute: Number(minutes) }).toJSDate(); 
  
      data.date = updatedDate; 
    }
  
    const updatedSchedule = await this.schedulesRepository.update({
      ...schedule,
      ...data,
      departmentId: departmentId,
    });
  
    return updatedSchedule;
  }  

  async delete(departmentId: string, scheduleId: string): Promise<boolean> {
    const department = await this.departmentRepostory.findById(departmentId);
  
    if (!department) {
      throw new Error("Department not found");
    }
  
    const schedule = await this.schedulesRepository.findByDepartmentAndId(departmentId, scheduleId);

    if (!schedule) {
      console.error(`Schedule with ID ${scheduleId} not found in department ${departmentId}`);
      throw new Error("Schedule not found");
    }
    
  
    await this.schedulesRepository.delete(scheduleId);
    return true;
  }
}

export { SchedulesUseCase }