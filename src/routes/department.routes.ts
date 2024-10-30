import { FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";
import { DepartmentUseCase } from "../usecases/department.usecase";
import { DepartmentSchemas } from "../../src/schema/department.schema";
import type { DepartmentCreate, DepartmentUpdate } from "../interfaces/department.interface";
import { verifyJWT } from "../middlewares/verify-jwt";

export async function departmentRoutes(fastify: FastifyInstance) {
  
  // Hook para verificar JWT em todas as rotas, exceto as de registro e login
  fastify.addHook("onRequest", async (req, reply) => {
    if (req.url === "/register" || req.url === "/login" || req.url === "/setup") return;
    await verifyJWT(req, reply);
  });

  const departmentUseCase = new DepartmentUseCase(); 

  // Endpoint para criar um novo departamento
  fastify.post<{ Body: DepartmentCreate }>('/departments', {
    schema: {
      security: [
        { bearerAuth: [] } // Adiciona segurança para o endpoint
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

  // Endpoint para atualizar um departamento existente
  fastify.put<{ Params: { id: string }, Body: DepartmentUpdate }>('/departments/:id', {
    schema: {
      security: [
        { bearerAuth: [] } 
      ],
      ...DepartmentSchemas.updateDepartment, // Utilize o spread para incluir todos os detalhes
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
}