import { ParticipantStatus, type ScheduleParticipant } from '@prisma/client';
import { ScheduleParticipantCreate, type ScheduleParticipantRepository } from '../interfaces/schedule.participant.interface';
import ScheduleParticipantRepositoryPrisma from '../repositories/schedule.participant.repository';

class ScheduleParticipantUseCase {
  private repository: ScheduleParticipantRepository;

  constructor() {
    this.repository = new ScheduleParticipantRepositoryPrisma();
  }

  
  async addParticipant(data: ScheduleParticipantCreate) {
    const existingParticipant = await this.repository.findUnique({
      userId: data.userId,
      scheduleId: data.scheduleId,
      departmentId: data.departmentId,
    });
  
    if (existingParticipant) {
      throw new Error('Participant already exists in this schedule');
    }
  
    
    await this.repository.create(data);
  
    
    return await this.repository.findParticipantsByScheduleIdAndDepartmentId(data.scheduleId, data.departmentId);
  }
  

  
  async removeParticipant(participantId: string, departmentId: string): Promise<void> {
    const participantExists = await this.repository.findById(participantId);

    if (!participantExists) {
      throw new Error('Participant not found');
    }

    
    const isAssociatedWithSchedule = await this.repository.findUnique({
      userId: participantExists.userId,
      scheduleId: participantExists.scheduleId,
      departmentId: departmentId, 
    });
    

    if (!isAssociatedWithSchedule) {
      throw new Error('Participant is not associated with this schedule in the specified department');
    }

    await this.repository.remove(participantId);
  }

  
  async updateParticipantStatus(scheduleId: string, participantId: string, status: ParticipantStatus, departmentId: string): Promise<ScheduleParticipant> {
    if (!Object.values(ParticipantStatus).includes(status)) {
      throw new Error('Invalid status');
    }
  
    const participant = await this.repository.findParticipantByIdAndDepartmentId(scheduleId, participantId, departmentId);
  
    if (!participant || participant.departmentId !== departmentId) {
      throw new Error('Participant not found in the specified department');
    }
  
    return await this.repository.updateParticipantStatus(participantId, status);
  }
  
  
  async listParticipants(departmentId: string, scheduleId: string): Promise<ScheduleParticipant[]> {
    const scheduleExists = await this.repository.findScheduleById(scheduleId, departmentId);
    if (!scheduleExists) {
      throw new Error('Schedule not found');
    }
    
    return await this.repository.findParticipantsByScheduleIdAndDepartmentId(scheduleId, departmentId);
  }
  
  
  async findParticipantById(scheduleId: string, participantId: string, departmentId: string) {
    const participant = await this.repository.findParticipantByIdAndDepartmentId(scheduleId, participantId, departmentId);
    if (!participant) {
      throw new Error('Participant not found');
    }
    return participant;
  }
}

export { ScheduleParticipantUseCase };
