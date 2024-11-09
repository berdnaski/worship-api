import type { ParticipantStatus } from "@prisma/client";

// Interface para um agendamento (schedule)
export interface Schedule {
  id: string;
  name: string;
  date: Date;
  departmentId: string;
  createdAt: Date;
  updatedAt: Date;
  participants?: {
    status: ParticipantStatus;
    user: {
      id: string;
      name: string;
      email: string;
      avatarUrl: string | null;
    };
  }[];
  songs?: {
    id: string;
    title: string;
    artist: string;
  }[];
}

// Interface para criação de agendamento (schedule)
export interface ScheduleCreate {
  name: string;
  date: Date;
  departmentId: string; // Adicionando departmentId para quando for criar o schedule
}

// Interface de resposta de agendamento (schedule) com detalhes
export interface ScheduleResponse {
  id: string;
  name: string;
  date: Date;
  departmentId: string;
  songs: {
    id: string;
    title: string;
    artist: string;
  }[];
  participants: {
    status: ParticipantStatus;
    user: {
      id: string;
      name: string;
      email: string;
      avatarUrl: string | null;
    };
  }[];
}

// Interface de agendamento com detalhes, usada para retornar todos os dados de uma schedule
export interface ScheduleWithDetails extends Schedule {
  participants?: {
    status: ParticipantStatus;
    user: {
      id: string;
      name: string;
      email: string;
      avatarUrl: string | null;
    };
  }[];
  songs?: {
    id: string;
    title: string;
    artist: string;
  }[];
}

// Interface para atualização de agendamento
export interface ScheduleUpdate {
  name?: string;
  date?: Date;  
}

// Interface do repositório de schedules
export interface SchedulesRepository {
  create(data: ScheduleCreate): Promise<Schedule>;
  findAllByDepartment(departmentId: string): Promise<ScheduleResponse[]>;
  findByDepartmentAndId(departmentId: string, scheduleId: string): Promise<Schedule | null>;
  update(data: Schedule & { departmentId: string }): Promise<Schedule>;
  delete(scheduleId: string): Promise<void>;
}
