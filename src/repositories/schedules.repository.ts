import type { Schedule } from "@prisma/client";
import type { ScheduleCreate, ScheduleResponse, SchedulesRepository } from "../interfaces/schedules.interface";
import { prisma } from "../database/prisma-client";

class SchedulesRepositoryPrisma implements SchedulesRepository {
  async create(data: ScheduleCreate & { departmentId: string }): Promise<Schedule> {
    return await prisma.schedule.create({
      data: {
        name: data.name,
        date: data.date,
        department: { connect: { id: data.departmentId } }
    },
    });
  }

  async findAllByDepartment(departmentId: string): Promise<ScheduleResponse[]> {
    return await prisma.schedule.findMany({
      where: {
        departmentId
      }
    });
  }
}

export { SchedulesRepositoryPrisma }