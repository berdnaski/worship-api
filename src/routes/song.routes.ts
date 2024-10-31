import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { SongUseCase } from "../usecases/song.usecase";
import { verifyJWT } from "../middlewares/verify-jwt";
import { SongSchemas } from "../schema/song.schema";
import type { UpdateSong } from "../interfaces/song.interface";

export async function songRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", async (req, reply) => {
    if (req.url === "/register" || req.url === "/login" || req.url === "/setup") return;
    await verifyJWT(req, reply);
  });

  const songUseCase = new SongUseCase();

  fastify.post('/songs', {
    schema: {
      security: [{ bearerAuth: [] }],
      body: SongSchemas.createSongSchema.body,
      response: SongSchemas.createSongSchema.response,
      tags: SongSchemas.createSongSchema.tags, 
    }
  }, async (req, reply) => {
    const { title, artist, genre } = req.body as { title: string; artist: string; genre?: string };

    try {
      const song = await songUseCase.create({ title, artist, genre });
      reply.status(201).send(song);
    } catch (error) {
      reply.status(400).send(error);
    }
  });

  fastify.get('/songs', {
    schema: {
      security: [{ bearerAuth: [] }],
      response: SongSchemas.listSongsSchema.response,
      tags: SongSchemas.listSongsSchema.tags,
    }
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const songs = await songUseCase.findAll();

      return reply.status(200).send(songs);
    } catch (error) {
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  });

  fastify.get<{ Params: { id: string } }>('/songs/:id', {
    schema: {
      security: [
        { bearerAuth: [] }
      ],
      ...SongSchemas.findSong,
    },
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = req.params as { id: string };

      const song = await songUseCase.findSongById(id);

      if (!song) {
        return reply.status(404).send({ message: 'Song not found' });
      }

      return reply.status(200).send(song);
    } catch (error) {
      const statusCode = (error instanceof Error && error.message.includes('Department not found')) ? 404 : 500;
      return reply.code(statusCode).send({ message: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  fastify.delete<{ Params: { id: string } }>('/songs/:id', {
    schema: {
      security: [
        { bearerAuth: [] }
      ],
      ...SongSchemas.deleteSongSchema,
    },
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = req.params as { id: string };

      await songUseCase.delete(id);

      return reply.status(204).send();
    } catch (error) {
      const statusCode = (error instanceof Error && error.message.includes('Department not found')) ? 404 : 500;
      return reply.code(statusCode).send({ message: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  fastify.put<{ Params: { id: string }; Body: UpdateSong }>('/songs/:id', {
    schema: {
      security: [
        { bearerAuth: [] }
      ],
      ...SongSchemas.updateSongSchema,
    },
  }, async (req: FastifyRequest<{ Params: { id: string }; Body: UpdateSong }>, reply: FastifyReply) => {
    try {
      const { id } = req.params;
      const updateData = req.body; 
    
      await songUseCase.update(id, updateData);
    
      const updatedSong = await songUseCase.findSongById(id);
      return reply.status(200).send(updatedSong);
    } catch (error) {
      const statusCode = (error instanceof Error && error.message.includes('Song not found')) ? 404 : 500;
      return reply.code(statusCode).send({ message: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });
}
