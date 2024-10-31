import type { ParticipantStatus, Schedule, ScheduleParticipant } from "@prisma/client";

export interface ScheduleParticipantCreate {
  scheduleId: string;
  userId: string;
}

export interface ScheduleParticipantRemove {
  participantId: string;
}

export interface ScheduleParticipantRepository {
  create(data: ScheduleParticipantCreate): Promise<ScheduleParticipant>;
  findUnique(where: { userId_scheduleId: { userId: string; scheduleId: string } }): Promise<ScheduleParticipant | null>;
  remove(participantId: string): Promise<void>;
  findById(participantId: string): Promise<ScheduleParticipant | null>;
  updateParticipantStatus(participantId: string, status: ParticipantStatus): Promise<ScheduleParticipant>;
  findScheduleById(scheduleId: string): Promise<Schedule | null>; 
  findParticipantsByScheduleId(scheduleId: string): Promise<ScheduleParticipant[]>; 
  findParticipantById(scheduleId: string, participantId: string): Promise<ScheduleParticipant | null>
}
