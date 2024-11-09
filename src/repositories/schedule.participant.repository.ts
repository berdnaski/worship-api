import type { ParticipantStatus, Schedule, ScheduleParticipant } from "@prisma/client";
import { prisma } from "../database/prisma-client";
import type { ScheduleParticipantCreate, ScheduleParticipantRepository } from "../interfaces/schedule.participant.interface";

class ScheduleParticipantRepositoryPrisma implements ScheduleParticipantRepository {
  async create(data: ScheduleParticipantCreate): Promise<ScheduleParticipant> {
    return await prisma.scheduleParticipant.create({
      data: {
        scheduleId: data.scheduleId,
        userId: data.userId,
        departmentId: data.departmentId, 
      },
    });
  }
  

  async findUnique(where: { userId: string; scheduleId: string; departmentId: string }): Promise<ScheduleParticipant | null> {
    return await prisma.scheduleParticipant.findFirst({
      where: {
        userId: where.userId,
        scheduleId: where.scheduleId,
        departmentId: where.departmentId,
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

  async findScheduleById(scheduleId: string, departmentId: string): Promise<Schedule | null> {
    return await prisma.schedule.findFirst({
      where: {
        id: scheduleId,
        departmentId: departmentId,
      },
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

  async findParticipantByIdAndDepartmentId(scheduleId: string, participantId: string, departmentId: string): Promise<ScheduleParticipant | null> {
    return await prisma.scheduleParticipant.findFirst({
      where: {
        id: participantId,
        scheduleId: scheduleId,
        department: {
          id: departmentId,  
        },
      },
    });
  }
  

  
  async findParticipantsByScheduleIdAndDepartmentId(scheduleId: string, departmentId: string): Promise<ScheduleParticipant[]> {
    return await prisma.scheduleParticipant.findMany({
      where: {
        scheduleId: scheduleId,
        departmentId: departmentId,
      },
    });
  }

  async findMany(where: { userId: string; scheduleId: string; departmentId: string }): Promise<ScheduleParticipant[]> {
    return prisma.scheduleParticipant.findMany({
      where: where,  
    });
  }
}

export default ScheduleParticipantRepositoryPrisma;
