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

export interface SchedulesRepository {
  create(data: ScheduleCreate & { departmentId: string }): Promise<Schedule>;
}
