export const SongSchemas = {
  createSongSchema: {
    description: 'Create a new song',
    tags: ['Song'], 
    body: {
      type: 'object',
      required: ['title', 'artist'],
      properties: {
        title: { type: 'string', description: 'Title of the song' },
        artist: { type: 'string', description: 'Artist of the song' },
        genre: { type: 'string', nullable: true, description: 'Genre of the song' },
      },
    },
    response: {
      201: {
        description: 'Song created successfully',
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The unique identifier of the song' },
          title: { type: 'string', description: 'Title of the song' },
          artist: { type: 'string', description: 'Artist of the song' },
          genre: { type: 'string', nullable: true, description: 'Genre of the song' },
          createdAt: { type: 'string', format: 'date-time', description: 'Creation date of the song' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Last update date of the song' },
        },
      },
      400: {
        description: 'Invalid request data',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },

  listSongsSchema: {
    description: 'List all songs',
    tags: ['Song'],
    response: {
      200: {
        description: 'List of songs',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'The unique identifier of the song' },
            title: { type: 'string', description: 'Title of the song' },
            artist: { type: 'string', description: 'Artist of the song' },
            genre: { type: 'string', nullable: true, description: 'Genre of the song' },
            createdAt: { type: 'string', format: 'date-time', description: 'Creation date of the song' },
            updatedAt: { type: 'string', format: 'date-time', description: 'Last update date of the song' },
          },
        },
      },
    },
  },

  findSong: {
    description: 'Find a song by ID',
    tags: ['Song'],
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', description: 'The unique identifier of the song' },
      },
    },
    response: {
      200: {
        description: 'Song found successfully',
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The unique identifier of the song' },
          title: { type: 'string', description: 'Title of the song' },
          artist: { type: 'string', description: 'Artist of the song' },
          genre: { type: 'string', nullable: true, description: 'Genre of the song' },
          createdAt: { type: 'string', format: 'date-time', description: 'Creation date of the song' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Last update date of the song' },
        },
      },
      404: {
        description: 'Song not found',
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

  deleteSongSchema: {
    description: 'Delete a song by ID',
    tags: ['Song'],
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', description: 'The unique identifier of the song' },
      },
    },
    response: {
      204: {
        description: 'Song deleted successfully',
      },
      404: {
        description: 'Song not found',
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

  updateSongSchema: {
    description: 'Update a song by ID',
    tags: ['Song'],
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', description: 'The unique identifier of the song' },
      },
    },
    body: {
      type: 'object',
      required: [],
      properties: {
        title: { type: 'string', description: 'Title of the song' },
        artist: { type: 'string', description: 'Artist of the song' },
        genre: { type: 'string', nullable: true, description: 'Genre of the song' },
      },
    },
    response: {
      200: {
        description: 'Song updated successfully',
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The unique identifier of the song' },
          title: { type: 'string', description: 'Title of the song' },
          artist: { type: 'string', description: 'Artist of the song' },
          genre: { type: 'string', nullable: true, description: 'Genre of the song' },
          createdAt: { type: 'string', format: 'date-time', description: 'Creation date of the song' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Last update date of the song' },
        },
      },
      404: {
        description: 'Song not found',
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