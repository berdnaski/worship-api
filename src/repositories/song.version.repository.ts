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

  async findAll(): Promise<SongVersionResponse[]> {
    return await prisma.songVersion.findMany();
  }

  async findById(id: string): Promise<SongVersion | null> {
    const songVersion = await prisma.songVersion.findUnique({
      where: {
        id,
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
}

export { SongVersionRepositoryPrisma };