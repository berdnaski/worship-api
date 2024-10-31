import type { ParticipantStatus, Schedule, ScheduleParticipant } from "@prisma/client";
import { prisma } from "../database/prisma-client";
import type { ScheduleParticipantCreate, ScheduleParticipantRepository } from "../interfaces/schedule.participant.interface";

class ScheduleParticipantRepositoryPrisma implements ScheduleParticipantRepository {
  async create(data: ScheduleParticipantCreate): Promise<ScheduleParticipant> {
    return await prisma.scheduleParticipant.create({
      data: {
        scheduleId: data.scheduleId,
        userId: data.userId,
      },
    });
  }

  async findUnique(where: { userId_scheduleId: { userId: string; scheduleId: string } }): Promise<ScheduleParticipant | null> {
    return await prisma.scheduleParticipant.findUnique({
      where: {
        userId_scheduleId: {
          userId: where.userId_scheduleId.userId,
          scheduleId: where.userId_scheduleId.scheduleId,
        },
      },
    });
  }

  async findById(participantId: string): Promise<ScheduleParticipant | null> {
    return await prisma.scheduleParticipant.findUnique({
      where: { id: participantId },
    });
  }

  async remove(participantId: string): Promise<void> {
    await prisma.scheduleParticipant.delete({
      where: { id: participantId },
    });
  }

  async updateParticipantStatus(participantId: string, status: ParticipantStatus): Promise<ScheduleParticipant> {
    return await prisma.scheduleParticipant.update({
      where: { id: participantId },
      data: { status },
    });
  }

  async findScheduleById(scheduleId: string): Promise<Schedule | null> {
    return await prisma.schedule.findUnique({
      where: { id: scheduleId }
    });
  }

  async findParticipantsByScheduleId(scheduleId: string): Promise<ScheduleParticipant[]> {
    return await prisma.scheduleParticipant.findMany({
      where: {
        scheduleId,
      }
    })
  }

  async findParticipantById(scheduleId: string, participantId: string): Promise<ScheduleParticipant | null> {
    return await prisma.scheduleParticipant.findFirst({
      where: {
        id: participantId,
        scheduleId: scheduleId,
      },
    });
  }
}

export default ScheduleParticipantRepositoryPrisma;
