export const userCreateSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    passwordHash: { type: 'string' },
    departmentId: { type: 'string', nullable: true },
    role: { type: 'string', enum: ['ADMIN', 'LEADER', 'MEMBER'], default: 'MEMBER' }
  },
  required: ['name', 'email', 'passwordHash']
};

export const userLoginSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' }
  },
  required: ['email', 'password']
};

export const userSetupSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    role: { type: 'string', enum: ['ADMIN', 'LEADER', 'MEMBER'] },
    code: { type: 'string', nullable: true }
  },
  required: ['userId', 'role']
};

export const userListResponseSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' },
      role: { type: 'string' },
      initialSetupCompleted: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      departmentId: { type: 'string', nullable: true }
    }
  }
};

export const userResponseSchema = {
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        name: { type: 'string' },
        role: { type: 'string', enum: ['ADMIN', 'LEADER', 'MEMBER'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  },
};

export const userUpdateSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    passwordHash: { type: 'string' },
    departmentId: { type: 'string', nullable: true },
    role: {
      type: 'string',
      enum: ['ADMIN', 'LEADER', 'MEMBER'],
    }
  },
  additionalProperties: false, 
};

