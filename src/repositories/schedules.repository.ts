import type { Schedule } from "@prisma/client";
import type { ScheduleCreate, SchedulesRepository } from "../interfaces/schedules.interface";
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
}

export { SchedulesRepositoryPrisma }