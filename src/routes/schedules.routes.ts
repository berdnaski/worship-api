import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { verifyJWT } from "../middlewares/verify-jwt";
import { SchedulesUseCase } from "../usecases/schedules.usecase";
import type { ScheduleCreate, ScheduleUpdate } from "../interfaces/schedules.interface";
import { ScheduleSchemas } from "../schema/schedules.schema";
import { verifyUserRole } from "../middlewares/verify-role";

export async function schedulesRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", async (req, reply) => {
    if (req.url === "/register" || req.url === "/login" || req.url === "/setup") return;
    await verifyJWT(req, reply);
  });

  const schedulesUseCase = new SchedulesUseCase();

  fastify.post<{ Body: ScheduleCreate; Params: { departmentId: string } }>('/departments/:departmentId/schedules', {
    preHandler: verifyUserRole('ADMIN', 'LEADER'), 
    schema: {
      security: [{ bearerAuth: [] }],
      ...ScheduleSchemas.createSchedule,
    },
  }, async (req: FastifyRequest<{ Params: { departmentId: string }; Body: ScheduleCreate }>, reply: FastifyReply) => {
    try {
      const { departmentId } = req.params;
      const scheduleData: ScheduleCreate = req.body;

      const schedule = await schedulesUseCase.create({ ...scheduleData, departmentId });

      return reply.status(201).send(schedule);
    } catch (error) {
      return reply.code(500).send({ message: 'Internal Server Error' });
    }
  });

  fastify.get('/departments/:departmentId/schedules', {
    schema: {
      security: [{ bearerAuth: [] }],
      ...ScheduleSchemas.listSchemas,
    },
  }, async (req: FastifyRequest<{ Params: { departmentId: string } }>, reply: FastifyReply) => {
    try {
      const { departmentId } = req.params;
      const schedules = await schedulesUseCase.findAll(departmentId);
      return reply.status(200).send(schedules);
    } catch (error) {
      return reply.code(500).send({ message: 'Internal Server Error' });
    }
  });

  fastify.get(
    '/departments/:departmentId/schedules/:scheduleId',
    {
      schema: {
        security: [{ bearerAuth: [] }],
        ...ScheduleSchemas.findSchedule,
      },
    },
    async (req: FastifyRequest<{ Params: { departmentId: string; scheduleId: string } }>, reply: FastifyReply) => {
      try {
        const { departmentId, scheduleId } = req.params;
        const schedule = await schedulesUseCase.findBySchedule(departmentId, scheduleId);

        if (!schedule) {
          return reply.code(404).send({ message: 'Schedule not found' });
        }

        return reply.send(schedule);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        return reply.code(500).send({ message: 'Internal Server Error' });
      }
    }
  );

  fastify.put<{ Params: { departmentId: string; scheduleId: string }; Body: ScheduleUpdate }>(
    '/departments/:departmentId/schedules/:scheduleId',
    {
      preHandler: verifyUserRole('ADMIN', 'LEADER'), 
      schema: {
        security: [{ bearerAuth: [] }],
        ...ScheduleSchemas.updateSchedule,
      },
    },
    async (req, reply) => {
      try {
        const { departmentId, scheduleId } = req.params;
        const data: ScheduleUpdate = req.body;
  
        const updatedSchedule = await schedulesUseCase.update(departmentId, scheduleId, data);
  
        if (!updatedSchedule) {
          return reply.code(404).send({ message: 'Schedule not found' });
        }
  
        return reply.send(updatedSchedule);
      } catch (error) {
        return reply.code(500).send({ message: 'Internal Server Error' });
      }
    }
  );
  

  fastify.delete<{ Params: { departmentId: string; scheduleId: string } }>(
    '/departments/:departmentId/schedules/:scheduleId',
    {
      preHandler: verifyUserRole('ADMIN', 'LEADER'), 
      schema: {
        security: [{ bearerAuth: [] }],
        ...ScheduleSchemas.deleteSchedule,
      },
    },
    async (req: FastifyRequest<{ Params: { departmentId: string; scheduleId: string } }>, reply: FastifyReply) => {
      try {
        const { departmentId, scheduleId } = req.params;
        await schedulesUseCase.delete(departmentId, scheduleId);
        return reply.code(204).send();
      } catch (error) {
        if (error instanceof Error && error.message === 'Schedule not found') {
          return reply.code(404).send({ message: 'Schedule not found' });
        }
        return reply.code(500).send({ message: 'Internal Server Error' });
      }
    }
  );
  
}
