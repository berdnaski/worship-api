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
      userId_scheduleId: {
        userId: data.userId,
        scheduleId: data.scheduleId,
      },
    });

    if (existingParticipant) {
      throw new Error('Participant already exists in this schedule');
    }

    return await this.repository.create(data);
  }

  async removeParticipant(participantId: string): Promise<void> {
    const participantExists = await this.repository.findById(participantId);

    if (!participantExists) {
        throw new Error('Participant not found');
    }

    const isAssociatedWithSchedule = await this.repository.findUnique({
        userId_scheduleId: {
            userId: participantExists.userId, 
            scheduleId: participantExists.scheduleId,
        },
    });

    if (!isAssociatedWithSchedule) {
        throw new Error('Participant is not associated with any schedule');
    }

    await this.repository.remove(participantId);
  }

  async updateParticipantStatus(participantId: string, status: ParticipantStatus): Promise<ScheduleParticipant> {
    if (!Object.values(ParticipantStatus).includes(status)) {
      throw new Error('Invalid status');
    }
    return await this.repository.updateParticipantStatus(participantId, status);
  }

  async listParticipants(scheduleId: string): Promise<ScheduleParticipant[]> {
    const scheduleExists = await this.repository.findScheduleById(scheduleId); 
    if (!scheduleExists) {
      throw new Error('Schedule not found');
    }
  
    return await this.repository.findParticipantsByScheduleId(scheduleId); 
  }

  async findParticipantById(scheduleId: string, participantId: string) {
    const participant = await this.repository.findParticipantById(scheduleId, participantId);
    if (!participant) {
      throw new Error('Participant not found');
    }
    return participant;
  }
}

export { ScheduleParticipantUseCase };
