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
    tags: ['Department'],
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

  listDepartments: {
    description: 'List all departments',
    tags: ['Department'],
    response: {
      200: {
        description: 'List of departments',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'The unique identifier of the department' },
            name: { type: 'string', description: 'The name of the department' },
            description: { type: 'string', description: 'A description of the department' },
            createdAt: { type: 'string', format: 'date-time', description: 'The date the department was created' },
            updatedAt: { type: 'string', format: 'date-time', description: 'The date the department was last updated' },
            users: { 
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: 'The unique identifier of the user' },
                  name: { type: 'string', description: 'The name of the user' },
                  email: { type: 'string', description: 'The email of the user' },
                  role: { type: 'string', description: 'The role of the user in the department' },
                },
              },
            },
          },
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

  deleteDepartment: {
    description: 'Delete an existing department',
    tags: ['Department'],
    params: {
      type: 'object',
      required: ['departmentId'],
      properties: {
        departmentId: { type: 'string', description: 'The unique identifier of the department' },
      },
    },
    response: {
      204: {
        description: 'Department deleted successfully',
      },
      404: {
        description: 'Department not found',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      403: {
        description: 'Permission denied',
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

  findDepartment: {
    description: 'Find a department by ID',
    tags: ['Department'],
    params: {
      type: 'object',
      required: ['departmentId'],
      properties: {
        departmentId: { type: 'string', description: 'The unique identifier of the department' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The unique identifier of the department' },
          name: { type: 'string', description: 'The name of the department' },
          description: { type: 'string', description: 'A description of the department' },
          createdAt: { type: 'string', format: 'date-time', description: 'The date the department was created' },
          updatedAt: { type: 'string', format: 'date-time', description: 'The date the department was last updated' },
          users: { 
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'The unique identifier of the user' },
                name: { type: 'string', description: 'The name of the user' },
                email: { type: 'string', description: 'The email of the user' },
                role: { type: 'string', description: 'The role of the user in the department' },
                avatarUrl: { type: 'string', description: 'The avatar URL of the user' },
              },
            },
          },
        },
      },
      404: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },


  
  addUserToDepartment: {
    description: 'Add a user to a department',
    tags: ['Department'],
    params: {
      type: 'object',
      required: ['departmentId', 'id'],
      properties: {
        departmentId: { type: 'string', description: 'The unique identifier of the department' },
        id: { type: 'string', description: 'The unique identifier of the user to be added' },
      },
    },
    response: {
      201: {
        description: 'User added to department successfully',
        type: 'object',
        properties: {
          message: { type: 'string', description: 'Success message' },
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

  removeUserFromDepartment: {
    description: 'Remove a user from a department',
    tags: ['Department'],
    params: {
      type: 'object',
      required: ['departmentId', 'userId'],
      properties: {
        departmentId: { type: 'string', description: 'The unique identifier of the department' },
        userId: { type: 'string', description: 'The unique identifier of the user to be removed' },
      },
    },
    response: {
      204: {
        description: 'User removed from department successfully',
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


