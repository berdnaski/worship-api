import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { verifyJWT } from "../middlewares/verify-jwt";
import { ScheduleParticipantUseCase } from "../usecases/schedule.participant.usecase";
import type { ScheduleParticipantCreate } from "../interfaces/schedule.participant.interface";
import { verifyUserRole } from "../middlewares/verify-role";
import { ScheduleParticipantSchemas } from "../schema/schedule.participant.schema";
import type { ParticipantStatus } from "@prisma/client";

export async function scheduleParticipantRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", async (req, reply) => {
    if (req.url === "/register" || req.url === "/login" || req.url === "/setup") return;
    await verifyJWT(req, reply);
  });

  const scheduleParticipantUseCase = new ScheduleParticipantUseCase();

  fastify.post<{ Body: ScheduleParticipantCreate; Params: { scheduleId: string } }>(
    '/schedules/:scheduleId/participants',
    {
      preHandler: verifyUserRole('ADMIN', 'LEADER'),
      schema: {
        security: [{ bearerAuth: [] }],
        ...ScheduleParticipantSchemas.addParticipant,
      },
    },
    async (req: FastifyRequest<{ Params: { scheduleId: string }; Body: ScheduleParticipantCreate }>, reply: FastifyReply) => {
      try {
        const { scheduleId } = req.params;
        const participantData: ScheduleParticipantCreate = { ...req.body, scheduleId };

        const participant = await scheduleParticipantUseCase.addParticipant(participantData);
        return reply.status(201).send(participant);
      } catch (error) {
        if (error instanceof Error && error.message === "Participant already exists in this schedule") {
          return reply.code(409).send({ message: 'Participant already exists in this schedule' });
        }
        return reply.code(500).send({ message: 'Internal Server Error' });
      }
    }
  );

  fastify.delete<{ Params: { scheduleId: string; participantId: string } }>(
    '/schedules/:scheduleId/participants/:participantId',
    {
      preHandler: verifyUserRole('ADMIN', 'LEADER'), 
      schema: {
        security: [{ bearerAuth: [] }],
        ...ScheduleParticipantSchemas.removeParticipant,
      },
    },
    async (req: FastifyRequest<{ Params: { scheduleId: string; participantId: string } }>, reply: FastifyReply) => {
      const { scheduleId, participantId } = req.params;
  
      try {
        await scheduleParticipantUseCase.removeParticipant(participantId);
        return reply.code(204).send(); 
      } catch (error: unknown) {
        if (error instanceof Error) { 
          if (error.message === 'Participant not found') {
            return reply.code(404).send({ message: 'Participant not found' });
          }
        }
        return reply.code(500).send({ message: 'Internal Server Error' });
      }
    }
  );
  
  fastify.patch<{ Params: { participantId: string }; Body: { status: string } }>(
    '/schedules/:scheduleId/participants/:participantId/status',
    {
      preHandler: verifyUserRole('ADMIN', 'LEADER'),
      schema: {
        security: [
          { bearerAuth: [] }
        ],
        ...ScheduleParticipantSchemas.removeParticipant,
        body: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'REJECTED'], description: 'O novo status do participante' },
          },
          required: ['status'],
        },
      },
    },
    async (req: FastifyRequest<{ Params: { participantId: string }; Body: { status: string } }>, reply: FastifyReply) => {
      const { participantId } = req.params;
      const { status: statusString } = req.body;
      const status: ParticipantStatus = statusString as ParticipantStatus;
  
      try {
        await scheduleParticipantUseCase.updateParticipantStatus(participantId, status);
        return reply.code(204).send(); 
      } catch (error) {
        if (error instanceof Error && error.message === 'Invalid status') {
          return reply.code(400).send({ message: 'Invalid status' });
        }
        return reply.code(500).send({ message: 'Internal Server Error' });
      }
    }
  );

  fastify.get<{ Params: { scheduleId: string } }>(
    '/schedules/:scheduleId/participants',
    {
      preHandler: verifyUserRole('ADMIN', 'LEADER'),
      schema: {
        security: [{ bearerAuth: [] }],
        ...ScheduleParticipantSchemas.listParticipants,
      },
    },
    async (req: FastifyRequest<{ Params: { scheduleId: string } }>, reply: FastifyReply) => {
      const { scheduleId } = req.params;
  
      try {
        const participants = await scheduleParticipantUseCase.listParticipants(scheduleId);
        return reply.code(200).send(participants);
      } catch (error) {
        if (error instanceof Error && error.message === 'Schedule not found') {
          return reply.code(404).send({ message: 'Schedule not found' });
        }
        return reply.code(500).send({ message: 'Internal Server Error' });
      }
    }
  );

  fastify.get<{ Params: { scheduleId: string; participantId: string } }>(
    '/schedules/:scheduleId/participants/:participantId',
    {
      preHandler: verifyUserRole('ADMIN', 'LEADER'),
      schema: {
        security: [{ bearerAuth: [] }],
        ...ScheduleParticipantSchemas.findParticipantById,
      },
    },
    async (req: FastifyRequest<{ Params: { scheduleId: string; participantId: string } }>, reply: FastifyReply) => {
      const { scheduleId, participantId } = req.params;
  
      try {
        const participant = await scheduleParticipantUseCase.findParticipantById(scheduleId, participantId);
        if (!participant) {
          return reply.code(404).send({ message: 'Participant not found' });
        }
        return reply.status(200).send(participant);
      } catch (error) {
        return reply.code(500).send({ message: 'Internal Server Error' });
      }
    }
  );
}
