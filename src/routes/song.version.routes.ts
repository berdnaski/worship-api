import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { SongVersionUseCase } from "../usecases/song.version.usecase";
import { verifyJWT } from "../middlewares/verify-jwt";
import type { CreateSongVersionRequestBody, SongVersionUpdate } from "../interfaces/song.version.interface";
import { SongVersionSchemas } from "../schema/song.version.schema";

export async function songVersionRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", async (req, reply) => {
    await verifyJWT(req, reply);
  });

  const songVersionUseCase = new SongVersionUseCase();

  fastify.post<{ Params: { songId: string }, Body: CreateSongVersionRequestBody }>('/songs/:songId/song-versions', {
    schema: {
      security: [
        { bearerAuth: [] } 
      ],
      ...SongVersionSchemas.createSongVersionSchema,
    }
  }, async (req: FastifyRequest<{ Params: { songId: string }, Body: CreateSongVersionRequestBody }>, reply: FastifyReply) => {
    const { songId } = req.params; 
    const { versionName, classification, key, linkChord, linkVideo } = req.body; 
  
    try {
      const songVersion = await songVersionUseCase.create({
        versionName,
        classification,
        key,
        linkChord,
        linkVideo,
      }, songId); 
  
      return reply.status(201).send(songVersion);
    } catch (error) {
      return reply.status(400).send();
    }
  });

  interface SongParams {
    songId: string; 
  }

    fastify.get('/songs/:songId/song-versions', {
      schema: {
        security: [{
          bearerAuth: [],
        }],
        ...SongVersionSchemas.listSongVersionsSchema,
      },
    }, async (req: FastifyRequest<{ Params: SongParams }>, reply: FastifyReply) => {
      try {
        const { songId } = req.params; 
        const songVersions = await songVersionUseCase.findAll(songId); 
    
        return reply.status(200).send(songVersions);
      } catch (error) {
        console.error(error); 
        return reply.code(500).send({ message: 'Internal Server Error' });
      }
    });
    

  fastify.get<{ Params: { songId: string; songVersionId: string } }>('/songs/:songId/song-versions/:songVersionId', {
    schema: {
      security: [{
        bearerAuth: [],
      }],
      ...SongVersionSchemas.getSongVersionSchema,
    },
  }, async (req: FastifyRequest<{ Params: { songId: string; songVersionId: string } }>, reply: FastifyReply) => {
    try {
      const { songId, songVersionId } = req.params;
  
      const songVersion = await songVersionUseCase.findById(songId, songVersionId); 
  
      if (!songVersion) {
        return reply.code(404).send({ message: 'Song version not found' });
      }
  
      return reply.status(200).send(songVersion);
    } catch (error) {
      return reply.code(500).send({ message: 'Internal Server Error' });
    }
  });
  
  fastify.delete<{ Params: { songId: string; songVersionId: string } }>('/songs/:songId/song-versions/:songVersionId', {
    schema: {
      security: [{
        bearerAuth: [],
      }],
      ...SongVersionSchemas.deleteSongVersionSchema,
    },
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { songId, songVersionId } = req.params as { songId: string; songVersionId: string };
    
    try {
      await songVersionUseCase.delete(songId, songVersionId);
  
      return reply.status(204).send(); 
    } catch (error) {
      return reply.code(500).send({ message: 'Internal Server Error' });
    }
  });
  
  
  fastify.put<{ Params: { songId: string; songVersionId: string }, Body: SongVersionUpdate }>('/songs/:songId/song-versions/:songVersionId', {
    schema: {
      security: [{
        bearerAuth: [],
      }],
      ...SongVersionSchemas.updateSongVersionSchema, 
    },
  }, async (req: FastifyRequest<{ Params: { songId: string; songVersionId: string }, Body: SongVersionUpdate }>, reply: FastifyReply) => {
    const { songId, songVersionId } = req.params as { songId: string; songVersionId: string }; 
    const data = req.body;
    
    try {
      const updatedSongVersion = await songVersionUseCase.update(songId, songVersionId, data); 
  
      return reply.status(200).send(updatedSongVersion);
    } catch (error) {
      return reply.code(500).send({ message: 'Internal Server Error' });
    }
  });
  
  
}