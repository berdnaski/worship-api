import { prisma } from "../database/prisma-client";
import type { CreateSongData, Song, SongRepository, SongResponse, UpdateSong } from "../interfaces/song.interface";

class SongRepositoryPrisma implements SongRepository {
  async create(data: CreateSongData): Promise<Song> {
    const song = await prisma.song.create({
      data,
    });
    
    return song;
  }

  async findAll(): Promise<SongResponse[]> {
    return await prisma.song.findMany();
  }

  async findSongById(id: string): Promise<Song | null> {
    const song = await prisma.song.findUnique({
      where: {
        id,
      },
    });

    return song;
  }

  async delete(id: string): Promise<void> {
    await prisma.songVersion.deleteMany({
        where: {
            songId: id,
        },
    });
    
    await prisma.song.delete({
        where: {
            id,
        },
    });
}

  async update(id: string, data: UpdateSong): Promise<Song | null> {
    return await prisma.song.update({
      where: { id },
      data,
    });
  }
}

export { SongRepositoryPrisma };