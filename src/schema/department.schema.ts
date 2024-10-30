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

  updateDepartment: {
    description: 'Update an existing department',
    tags: ['Department'], // A mesma tag para garantir o agrupamento
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', description: 'The unique identifier of the department' },
      },
    },
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'The updated name of the department' },
        description: { type: 'string', description: 'The updated description of the department' },
      },
    },
    response: {
      200: {
        description: 'Department updated successfully',
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The unique identifier of the department' },
          name: { type: 'string', description: 'The updated name of the department' },
          description: { type: 'string', description: 'The updated description of the department' },
          createdAt: { type: 'string', format: 'date-time', description: 'The date the department was created' },
          updatedAt: { type: 'string', format: 'date-time', description: 'The date the department was last updated' },
        },
      },
      404: {
        description: 'Department not found',
        type: 'object',
        properties: {
          message: { type: 'string' },
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