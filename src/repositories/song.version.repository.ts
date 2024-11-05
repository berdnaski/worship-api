import { prisma } from "../database/prisma-client";
import type { SongVersion, SongVersionCreate, SongVersionRepository, SongVersionResponse, SongVersionUpdate } from "../interfaces/song.version.interface";

class SongVersionRepositoryPrisma implements SongVersionRepository {
  async create(data: SongVersionCreate, songId: string): Promise<SongVersion> {
    const songVersion = await prisma.songVersion.create({
      data: {
        ...data,
        songId, 
      },
    });

    return songVersion;
  }

  async findAll(songId: string): Promise<SongVersionResponse[]> {
    return await prisma.songVersion.findMany({
      where: {
        songId: songId,
      },
    });
  }
  

  async findById(songId: string, songVersionId: string): Promise<SongVersion | null> {
    const songVersion = await prisma.songVersion.findFirst({
      where: {
        id: songVersionId,
        songId: songId,
      }
    });
  
    return songVersion;
  }
  
  

  async delete(id: string): Promise<void> {
    await prisma.songVersion.delete({
      where: {
        id: id,
      }
    });
  }

  async update(id: string, data: SongVersionUpdate): Promise<SongVersion | null> {
    const songVersion = await prisma.songVersion.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return songVersion;
  }

  async findBySongId(songId: string): Promise<SongVersionResponse[]> {
    return await prisma.songVersion.findMany({
      where: {
        songId: songId, 
      },
    });
  }
  
}

export { SongVersionRepositoryPrisma };