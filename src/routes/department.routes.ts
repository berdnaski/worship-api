import { FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";
import { DepartmentUseCase } from "../usecases/department.usecase";
import { DepartmentSchemas } from "../../src/schema/department.schema";
import type { DepartmentCreate, DepartmentUpdate } from "../interfaces/department.interface";
import { verifyJWT } from "../middlewares/verify-jwt";

export async function departmentRoutes(fastify: FastifyInstance) {

  fastify.addHook("onRequest", async (req, reply) => {
    if (req.url === "/register" || req.url === "/login" || req.url === "/setup") return;
    await verifyJWT(req, reply);
  });

  const departmentUseCase = new DepartmentUseCase(); 

  fastify.post<{ Body: DepartmentCreate }>('/departments', {
    schema: {
      security: [
        { bearerAuth: [] } 
      ],
      ...DepartmentSchemas.createDepartment,
    },
  }, async (req, reply) => {
    try {
      if (!req.user || !req.user.sub) {
        return reply.code(401).send({ message: 'Unauthorized' });
      }

      const departmentData = req.body;
      const id = req.user.sub;
  
      const department = await departmentUseCase.create(departmentData, id);
  
      return reply.code(201).send(department);
    } catch (error) {
      const statusCode = (error instanceof Error && error.message.includes('Forbidden')) ? 403 : 500;

      return reply.code(statusCode).send({ message: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  fastify.put<{ Params: { id: string }, Body: DepartmentUpdate }>('/departments/:id', {
    schema: {
      security: [
        { bearerAuth: [] } 
      ],
      ...DepartmentSchemas.updateDepartment, 
    },
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = req.params as { id: string };
      const data = req.body as DepartmentUpdate;

      const updatedDepartment = await departmentUseCase.update(id, data);

      if (!updatedDepartment) {
        return reply.code(404).send({ message: 'Department not found' });
      }

      return reply.status(200).send(updatedDepartment);
    } catch (error) {
      return reply.code(500).send({ message: 'Internal Server Error' });
    }
  });

  fastify.get('/departments', {
    schema: {
      security: [
        { bearerAuth: [] }
      ],
      ...DepartmentSchemas.listDepartments,
    },
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const departments = await departmentUseCase.findAll();
      return reply.status(200).send(departments);
    } catch (error) {
      return reply.code(500).send({ message: 'Internal Server Error' });
    }
  });

  fastify.delete('/departments/:departmentId', {
    schema: {
      security: [
        { bearerAuth: [] }
      ],
      ...DepartmentSchemas.deleteDepartment,
    },
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { departmentId } = req.params as { departmentId: string };
      const requesterRole = req.user.role; 
      const requesterId = req.user.sub; 
  
      if (requesterRole !== "ADMIN" && requesterRole !== "LEADER") {
        return reply.code(403).send({ message: "Permission denied" });
      }
  
      await departmentUseCase.delete(departmentId, requesterId, requesterRole);
  
      return reply.code(204).send(); 
    } catch (error) {
      const statusCode = (error instanceof Error && error.message.includes('Permission denied')) ? 403 : 500;
      const message = error instanceof Error ? error.message : 'Internal Server Error';
  
      return reply.code(statusCode).send({ message });
    }
  });
}