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
        departmentId,
      },
      include: {
        participants: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,  
              },
            },
            status: true,  
          },
        },
        songs: { 
          select: {
            id: true,
            title: true,
            artist: true,
          },
        },
      },
    });
  }
  
  
  async findByDepartmentAndId(departmentId: string, scheduleId: string): Promise<Schedule | null> {
    return await prisma.schedule.findFirst({
      where: {
        id: scheduleId,
        departmentId: departmentId,
      },
      include: {
        participants: {
          include: {
            user: true,  
          },
        },
        songs: true, 
      },
    });
  }
  

  async update(data: Schedule & { departmentId: string }): Promise<Schedule> {
    return await prisma.schedule.update({
        where: {
            id: data.id,
        },
        data: {
            name: data.name,
            date: data.date,
            departmentId: data.departmentId,
        },
    });
  }

  async delete(scheduleId: string): Promise<void> {
    try {
      
      await prisma.scheduleParticipant.deleteMany({
        where: {
          scheduleId: scheduleId,
        },
      });
  
      
      await prisma.schedule.delete({
        where: {
          id: scheduleId,
        },
      });
    } catch (error) {
      console.error("Error deleting schedule:", error);
      throw new Error("Failed to delete schedule");
    }
  }
  
  
}

export { SchedulesRepositoryPrisma }