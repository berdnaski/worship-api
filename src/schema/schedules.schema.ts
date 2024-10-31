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
};
