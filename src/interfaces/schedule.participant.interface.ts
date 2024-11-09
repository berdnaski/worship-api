import type { ParticipantStatus, Schedule, ScheduleParticipant } from "@prisma/client";

export interface ScheduleParticipantCreate {
  scheduleId: string;
  userId: string;
  departmentId: string;
}

export interface ScheduleParticipantRemove {
  participantId: string;
  departmentId: string;
}

export interface ScheduleParticipantRepository {
  create(data: ScheduleParticipantCreate): Promise<ScheduleParticipant>;
  findUnique(where: { userId: string; scheduleId: string; departmentId: string }): Promise<ScheduleParticipant | null>;
  findById(participantId: string): Promise<ScheduleParticipant | null>;
  remove(participantId: string): Promise<void>;
  updateParticipantStatus(participantId: string, status: ParticipantStatus): Promise<ScheduleParticipant>;
  findScheduleById(scheduleId: string, departmentId: string): Promise<Schedule | null>
  findParticipantsByScheduleIdAndDepartmentId(scheduleId: string, departmentId: string): Promise<ScheduleParticipant[]>;
  findParticipantByIdAndDepartmentId(scheduleId: string, participantId: string, departmentId: string): Promise<ScheduleParticipant | null>;
  findParticipantById(scheduleId: string, participantId: string): Promise<ScheduleParticipant | null>; // Adicione esta linha
}
