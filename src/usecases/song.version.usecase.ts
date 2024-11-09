import type { SongVersion } from "@prisma/client";
import type { SongRepository } from "../interfaces/song.interface";
import type { SongVersionCreate, SongVersionRepository, SongVersionResponse, SongVersionUpdate } from "../interfaces/song.version.interface";
import { SongRepositoryPrisma } from "../repositories/song.repository";
import { SongVersionRepositoryPrisma } from "../repositories/song.version.repository";

class SongVersionUseCase {
  private songVersionRepository: SongVersionRepository;
  private songRepository: SongRepository;

  constructor() {
    this.songVersionRepository = new SongVersionRepositoryPrisma();
    this.songRepository = new SongRepositoryPrisma();
  }

  async create(data: SongVersionCreate, songId: string): Promise<SongVersion> {
    const songExists = await this.songRepository.findSongById(songId); 

    if (!songExists) {
      throw new Error("Song not found");
    }

    const songVersion = await this.songVersionRepository.create(data, songId); 

    return songVersion;
  }

  async findAll(songId: string): Promise<SongVersionResponse[]> {
    const songVersions = await this.songVersionRepository.findBySongId(songId); 
  
    return songVersions.map(songVersion => ({
      id: songVersion.id,
      versionName: songVersion.versionName,
      classification: songVersion.classification,
      key: songVersion.key,
      linkChord: songVersion.linkChord,
      linkVideo: songVersion.linkVideo, 
    }));
  }

  async findById(songId: string, songVersionId: string): Promise<SongVersion | null> {
    const songVersion = await this.songVersionRepository.findById(songId, songVersionId);

    return songVersion || null; 
}

  async delete(songId: string, songVersionId: string): Promise<void> {
    const songVersionExists = await this.songVersionRepository.findById(songId, songVersionId);

    if (!songVersionExists) {
      throw new Error("Song version not found");
    }

    await this.songVersionRepository.delete(songVersionId);
  }

  async update(songId: string, songVersionId: string, data: SongVersionUpdate): Promise<SongVersion | null> {
    const songVersion = await this.songVersionRepository.findById(songId, songVersionId);

    if (!songVersion) {
      throw new Error("Song version not found");
    }

    const update = await this.songVersionRepository.update(songVersionId, data);

    return update;
  }
}

export { SongVersionUseCase };
