export const ScheduleParticipantSchemas = {
  addParticipant: {
    description: 'Add a participant to a schedule',
    tags: ['Schedule Participant'],
    params: {
      type: 'object',
      properties: {
        scheduleId: { type: 'string', description: 'The unique identifier of the schedule' },
      },
      required: ['scheduleId'],
    },
    body: {
      type: 'object',
      required: ['userId'],
      properties: {
        userId: { type: 'string', description: 'The unique identifier of the user to be added as a participant' },
      },
    },
    response: {
      201: {
        description: 'Participant added successfully',
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The unique identifier of the schedule participant' },
          scheduleId: { type: 'string', description: 'The unique identifier of the schedule' },
          userId: { type: 'string', description: 'The unique identifier of the user' },
          status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'REJECTED'], description: 'The status of the participant' },
          createdAt: { type: 'string', format: 'date-time', description: 'The date the participant was added' },
          updatedAt: { type: 'string', format: 'date-time', description: 'The date the participant was last updated' },
        },
      },
      409: {
        description: 'Participant already exists in this schedule',
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

  updateParticipantStatus: {
    description: 'Update the status of a participant',
    tags: ['Schedule Participant'],
    params: {
      type: 'object',
      properties: {
        participantId: { type: 'string', description: 'The unique identifier of the participant' },
      },
      required: ['participantId'],
    },
    body: {
      type: 'object',
      properties: {
        status: { 
          type: 'string', 
          enum: ['PENDING', 'CONFIRMED', 'REJECTED'], 
          description: 'The new status of the participant' 
        },
      },
      required: ['status'],
    },
    response: {
      204: {
        description: 'Participant status updated successfully',
      },
      400: {
        description: 'Invalid status',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      404: {
        description: 'Participant not found',
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

  listParticipants: {
    description: 'List all participants of a specific schedule',
    tags: ['Schedule Participant'],
    params: {
      type: 'object',
      properties: {
        scheduleId: { type: 'string', description: 'The unique identifier of the schedule' },
      },
      required: ['scheduleId'],
    },
    response: {
      200: {
        description: 'Participants retrieved successfully',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'The unique identifier of the schedule participant' },
            scheduleId: { type: 'string', description: 'The unique identifier of the schedule' },
            userId: { type: 'string', description: 'The unique identifier of the user' },
            status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'REJECTED'], description: 'The status of the participant' },
            createdAt: { type: 'string', format: 'date-time', description: 'The date the participant was added' },
            updatedAt: { type: 'string', format: 'date-time', description: 'The date the participant was last updated' },
          },
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

  removeParticipant: {
    description: 'Remove a participant from a schedule',
    tags: ['Schedule Participant'],
    params: {
      type: 'object',
      properties: {
        scheduleId: { type: 'string', description: 'The unique identifier of the schedule' },
        participantId: { type: 'string', description: 'The unique identifier of the participant to remove' },
      },
      required: ['scheduleId', 'participantId'], 
    },
    response: {
      204: {
        description: 'Participant removed successfully', 
      },
      404: {
        description: 'Participant or Schedule not found',
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

  findParticipantById: {
    description: 'Find a specific participant of a schedule by their ID',
    tags: ['Schedule Participant'],
    params: {
      type: 'object',
      properties: {
        scheduleId: { type: 'string', description: 'The unique identifier of the schedule' },
        participantId: { type: 'string', description: 'The unique identifier of the participant' },
      },
      required: ['scheduleId', 'participantId'],
    },
    response: {
      200: {
        description: 'Participant retrieved successfully',
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The unique identifier of the schedule participant' },
          scheduleId: { type: 'string', description: 'The unique identifier of the schedule' },
          userId: { type: 'string', description: 'The unique identifier of the user' },
          status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'REJECTED'], description: 'The status of the participant' },
          createdAt: { type: 'string', format: 'date-time', description: 'The date the participant was added' },
          updatedAt: { type: 'string', format: 'date-time', description: 'The date the participant was last updated' },
        },
      },
      404: {
        description: 'Participant not found',
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
