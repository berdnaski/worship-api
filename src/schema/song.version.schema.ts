export const SongVersionSchemas = {
  createSongVersionSchema: {
    description: 'Create a new song version',
    tags: ['SongVersion'], // Atribuindo à tag correta
    body: {
      type: 'object',
      required: ['versionName', 'classification', 'key'], // Removido songId
      properties: {
        versionName: { type: 'string', description: 'Name of the song version' },
        classification: { type: 'string', description: 'Classification of the song version' },
        key: { type: 'string', description: 'Key of the song version' },
        linkChord: { type: 'string', nullable: true, description: 'Link to chords' },
        linkVideo: { type: 'string', nullable: true, description: 'Link to video' },
      },
    },
    response: {
      201: {
        description: 'Song version created successfully',
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The unique identifier of the song version' },
          versionName: { type: 'string', description: 'Name of the song version' },
          songId: { type: 'string', description: 'ID of the song this version belongs to' }, // Certifique-se de que isso ainda está correto
          classification: { type: 'string', description: 'Classification of the song version' },
          key: { type: 'string', description: 'Key of the song version' },
          linkChord: { type: 'string', nullable: true, description: 'Link to chords' },
          linkVideo: { type: 'string', nullable: true, description: 'Link to video' },
          createdAt: { type: 'string', format: 'date-time', description: 'Creation date of the song version' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Last update date of the song version' },
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

  listSongVersionsSchema: {
    description: 'List all versions of a specific song',
    tags: ['SongVersion'], 
    response: {
      200: {
        description: 'List of song versions',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'The unique identifier of the song version' },
            versionName: { type: 'string', description: 'Name of the song version' },
            songId: { type: 'string', description: 'ID of the song this version belongs to' },
            classification: { type: 'string', description: 'Classification of the song version' },
            key: { type: 'string', description: 'Key of the song version' },
            linkChord: { type: 'string', nullable: true, description: 'Link to chords' },
            linkVideo: { type: 'string', nullable: true, description: 'Link to video' },
            createdAt: { type: 'string', format: 'date-time', description: 'Creation date of the song version' },
            updatedAt: { type: 'string', format: 'date-time', description: 'Last update date of the song version' },
          },
        },
      },
      500: {
        description: 'Internal Server Error',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },

  getSongVersionSchema: {
    description: 'Get a specific song version',
    tags: ['SongVersion'],
    params: {
      type: 'object',
      required: ['songId', 'songVersionId'],
      properties: {
        songId: { type: 'string', description: 'ID of the song' },
        songVersionId: { type: 'string', description: 'ID of the song version' },
      },
    },
    response: {
      200: {
        description: 'Song version retrieved successfully',
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The unique identifier of the song version' },
          versionName: { type: 'string', description: 'Name of the song version' },
          songId: { type: 'string', description: 'ID of the song this version belongs to' },
          classification: { type: 'string', description: 'Classification of the song version' },
          key: { type: 'string', description: 'Key of the song version' },
          linkChord: { type: 'string', nullable: true, description: 'Link to chords' },
          linkVideo: { type: 'string', nullable: true, description: 'Link to video' },
          createdAt: { type: 'string', format: 'date-time', description: 'Creation date of the song version' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Last update date of the song version' },
        },
      },
      404: {
        description: 'Song version not found',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      500: {
        description: 'Internal Server Error',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },

  updateSongVersionSchema: {
    description: 'Update an existing song version',
    tags: ['SongVersion'],
    params: {
      type: 'object',
      required: ['songId', 'songVersionId'],
      properties: {
        songId: { type: 'string', description: 'ID of the song' },
        songVersionId: { type: 'string', description: 'ID of the song version' },
      },
    },
    body: {
      type: 'object',
      properties: {
        versionName: { type: 'string', description: 'Name of the song version' },
        classification: { type: 'string', description: 'Classification of the song version' },
        key: { type: 'string', description: 'Key of the song version' },
        linkChord: { type: 'string', nullable: true, description: 'Link to chords' },
        linkVideo: { type: 'string', nullable: true, description: 'Link to video' },
      },
    },
    response: {
      200: {
        description: 'Song version updated successfully',
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The unique identifier of the song version' },
          versionName: { type: 'string', description: 'Name of the song version' },
          songId: { type: 'string', description: 'ID of the song this version belongs to' },
          classification: { type: 'string', description: 'Classification of the song version' },
          key: { type: 'string', description: 'Key of the song version' },
          linkChord: { type: 'string', nullable: true, description: 'Link to chords' },
          linkVideo: { type: 'string', nullable: true, description: 'Link to video' },
          createdAt: { type: 'string', format: 'date-time', description: 'Creation date of the song version' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Last update date of the song version' },
        },
      },
      404: {
        description: 'Song version not found',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      500: {
        description: 'Internal Server Error',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },

  deleteSongVersionSchema: {
    description: 'Delete an existing song version',
    tags: ['SongVersion'],
    params: {
      type: 'object',
      required: ['songId', 'songVersionId'],
      properties: {
        songId: { type: 'string', description: 'ID of the song' },
        songVersionId: { type: 'string', description: 'ID of the song version to delete' },
      },
    },
    response: {
      204: {
        description: 'Song version deleted successfully',
      },
      404: {
        description: 'Song version not found',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      500: {
        description: 'Internal Server Error',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  }
  
};
