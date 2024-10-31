export interface Schedule {
  id: string;
  name: string;
  date: Date;
  departmentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleCreate {
  name: string;
  date: Date;
}

export interface ScheduleResponse {
  name: string;
  date: Date;
}

export interface ScheduleUpdate {
  name: string;
  date: Date;
}

export interface SchedulesRepository {
  create(data: ScheduleCreate & { departmentId: string }): Promise<Schedule>;
  findAllByDepartment(departmentId: string): Promise<ScheduleResponse[]>;
  findByDepartmentAndId(departmentId: string, scheduleId: string): Promise<Schedule | null>;
  update(data: Schedule & { departmentId: string }): Promise<Schedule>;
  delete(scheduleId: string): Promise<void>
}
