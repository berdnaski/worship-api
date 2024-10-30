export const DepartmentSchemas = {
  createDepartment: {
    description: 'Create a new department',
    tags: ['Department'],
    body: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', description: 'The name of the department' },
        description: { type: 'string', description: 'A description of the department' },
      },
    },
    response: {
      201: {
        description: 'Department created successfully',
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The unique identifier of the department' },
          name: { type: 'string', description: 'The name of the department' },
          description: { type: 'string', description: 'A description of the department' },
          createdAt: { type: 'string', format: 'date-time', description: 'The date the department was created' },
          updatedAt: { type: 'string', format: 'date-time', description: 'The date the department was last updated' },
        },
      },
      500: {
        description: 'Internal server error',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
};
