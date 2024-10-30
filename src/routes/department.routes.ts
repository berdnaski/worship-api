import { FastifyInstance } from "fastify";
import { DepartmentUseCase } from "../usecases/department.usecase";
import { DepartmentSchemas } from "../../src/schema/department.schema";
import type { DepartmentCreate } from "../interfaces/department.interface";
import { verifyJWT } from "../middlewares/verify-jwt";

export async function departmentRoutes(fastify: FastifyInstance) {

  fastify.addHook("onRequest", async (req, reply) => {
    if (req.url === "/register" || req.url === "/login" || req.url === "/setup") return;
    await verifyJWT(req, reply);
  });

  const departmentUseCase = new DepartmentUseCase(); 

  fastify.post<{ Body: DepartmentCreate }>('/departments', {
    schema: DepartmentSchemas.createDepartment,
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
  
}
