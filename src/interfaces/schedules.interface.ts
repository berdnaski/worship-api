import type { ParticipantStatus } from "@prisma/client";

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


export interface ScheduleCreate {
  name: string;
  date: Date;
}

export interface ScheduleResponse {
  name: string;
  date: Date;
  departmentId: string;
}

export interface ScheduleResponse {
  id: string;
  name: string;
  date: Date;
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


export interface ScheduleUpdate {
  name?: string;
  date?: Date;  
  time?: string;
}

export interface SchedulesRepository {
  create(data: ScheduleCreate & { departmentId: string }): Promise<Schedule>;
  findAllByDepartment(departmentId: string): Promise<ScheduleResponse[]>;
  findByDepartmentAndId(departmentId: string, scheduleId: string): Promise<Schedule | null>;
  update(data: Schedule & { departmentId: string }): Promise<Schedule>
  delete(scheduleId: string): Promise<void>
}
