import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../middlewares/verify-jwt";
import { SchedulesUseCase } from "../usecases/schedules.usecase";
import type { ScheduleCreate } from "../interfaces/schedules.interface";
import { ScheduleSchemas } from "../schema/schedules.schema";

export async function schedulesRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", async (req, reply) => {
    if (req.url === "/register" || req.url === "/login" || req.url === "/setup") return;
    await verifyJWT(req, reply);
  });

  const schedulesUseCase = new SchedulesUseCase();

  fastify.post<{ Body: ScheduleCreate, Params: { departmentId: string } }>('/departments/:departmentId/schedules', {
    schema: {
      security: [
        { bearerAuth: [] }
      ],
      ...ScheduleSchemas.createSchedule,
    },
  }, async (req, reply) => {
    try {
      const { departmentId } = req.params; 
      const scheduleData: ScheduleCreate = {
        name: req.body.name,
        date: req.body.date,
      };
  
      const schedule = await schedulesUseCase.create({ ...scheduleData, departmentId }); 
  
      return reply.status(201).send(schedule);
    } catch (error) {
      return reply.code(500).send({ message: 'Internal Server Error' });
    }
  });

  fastify.get('/departments/:departmentId/schedules', {
    schema: {
        security: [
            { bearerAuth: [] }
        ],
        ...ScheduleSchemas.listSchemas,
    }
    }, async (req, reply) => {
        try {
            const { departmentId } = req.params as { departmentId: string };

            const schedules = await schedulesUseCase.findAll(departmentId);
            
            return reply.status(200).send(schedules);
        } catch (error: unknown) { 
            if (error instanceof Error) { 
                if (error.message === "Department not found") {
                    return reply.status(404).send({ message: 'Department not found' });
                }
                return reply.status(500).send({ message: 'Internal Server Error' });
            }

            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
}