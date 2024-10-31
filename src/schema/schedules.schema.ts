export const ScheduleSchemas = {
  createSchedule: {
    description: 'Create a new schedule',
    tags: ['Schedule'],
    body: {
      type: 'object',
      required: ['name', 'date'],
      properties: {
        name: { type: 'string', description: 'The name of the schedule' },
        date: { type: 'string', format: 'date-time', description: 'The date of the schedule' },
      },
    },
    response: {
      201: {
        description: 'Schedule created successfully',
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The unique identifier of the schedule' },
          name: { type: 'string', description: 'The name of the schedule' },
          date: { type: 'string', format: 'date-time', description: 'The date of the schedule' },
          departmentId: { type: 'string', description: 'The unique identifier of the department' },
          createdAt: { type: 'string', format: 'date-time', description: 'The date the schedule was created' },
          updatedAt: { type: 'string', format: 'date-time', description: 'The date the schedule was last updated' },
        },
      },
      400: {
        description: 'Bad request',
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
  
  // Novo Schema para Listar Escalas
  listSchemas: {
    description: 'List all schedules for a specific department',
    tags: ['Schedule'],
    params: {
      type: 'object',
      properties: {
        departmentId: { type: 'string', description: 'The unique identifier of the department' },
      },
      required: ['departmentId'],
    },
    response: {
      200: {
        description: 'Schedules retrieved successfully',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'The unique identifier of the schedule' },
            name: { type: 'string', description: 'The name of the schedule' },
            date: { type: 'string', format: 'date-time', description: 'The date of the schedule' },
            createdAt: { type: 'string', format: 'date-time', description: 'The date the schedule was created' },
            updatedAt: { type: 'string', format: 'date-time', description: 'The date the schedule was last updated' },
          },
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

  findSchedule: {
    description: 'Get a single schedule by ID within a department',
    tags: ['Schedule'],
    response: {
      200: {
        description: 'Schedule retrieved successfully',
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The unique identifier of the schedule' },
          name: { type: 'string', description: 'The name of the schedule' },
          date: { type: 'string', format: 'date-time', description: 'The date and time of the schedule' },
          departmentId: { type: 'string', description: 'The unique identifier of the department' },
          createdAt: { type: 'string', format: 'date-time', description: 'The date the schedule was created' },
          updatedAt: { type: 'string', format: 'date-time', description: 'The date the schedule was last updated' },
        },
      },
      404: {
        description: 'Schedule not found',
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

  updateSchedule: {
    description: 'Update an existing schedule',
    tags: ['Schedule'],
    body: {
      type: 'object',
      required: ['name', 'date'],
      properties: {
        name: { type: 'string', description: 'The name of the schedule' },
        date: { type: 'string', format: 'date-time', description: 'The new date and time of the schedule' },
      },
    },
    response: {
      200: {
        description: 'Schedule updated successfully',
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The unique identifier of the schedule' },
          name: { type: 'string', description: 'The updated name of the schedule' },
          date: { type: 'string', format: 'date-time', description: 'The updated date and time of the schedule' },
          departmentId: { type: 'string', description: 'The unique identifier of the department' },
          createdAt: { type: 'string', format: 'date-time', description: 'The date the schedule was created' },
          updatedAt: { type: 'string', format: 'date-time', description: 'The date the schedule was last updated' },
        },
      },
      404: {
        description: 'Schedule not found',
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

  deleteSchedule: {
    description: 'Delete a schedule by ID within a department',
    tags: ['Schedule'],
    params: {
      type: 'object',
      properties: {
        departmentId: { type: 'string', description: 'The unique identifier of the department' },
        scheduleId: { type: 'string', description: 'The unique identifier of the schedule' },
      },
      required: ['departmentId', 'scheduleId'],
    },
    response: {
      204: {
        description: 'Schedule deleted successfully',
      },
      404: {
        description: 'Schedule not found',
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
