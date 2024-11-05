import type { CreateSongData, Song, SongRepository, SongResponse, UpdateSong } from "../interfaces/song.interface";
import { SongRepositoryPrisma } from "../repositories/song.repository";

class SongUseCase {
  private songRepository: SongRepository;

  constructor() {
    this.songRepository = new SongRepositoryPrisma();
  }

  async create(data: CreateSongData): Promise<Song> {
    if (!data.title || !data.artist) {
      throw new Error("Title and artist are required");
    }

    const song = await this.songRepository.create(data);

    return song;
  }

  async findAll(): Promise<SongResponse[]> {
    const songs = await this.songRepository.findAll();

    return songs.map(song => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      genre: song.genre,
      createdAt: song.createdAt,
      updatedAt: song.updatedAt,
    }))
  }

  async findSongById(id: string): Promise<Song | null> {
    const song = await this.songRepository.findSongById(id);

    if (!song) {
      throw new Error("Song not found");
    }

    return song;
  }

  async delete(id: string): Promise<void> {
    const song = await this.songRepository.findSongById(id);

    if (!song) {
      throw new Error("Song not found");
    }

    await this.songRepository.delete(id);
  }

  async update(id: string, data: UpdateSong): Promise<Song | null> {
    const song = await this.songRepository.findSongById(id);

    if (!song) {
      throw new Error("Song not found");
    }

    const update = await this.songRepository.update(id, data);

    return update;
  }
}

export { SongUseCase }