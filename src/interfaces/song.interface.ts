export interface Song {
  id: string;
  title: string;
  artist: string;
  genre?: string | null; 
  scheduleId?: string | null;  
  createdAt: Date;
  updatedAt: Date;
}

export interface SongResponse {
  id: string;
  title: string;
  artist: string;
  genre?: string | null;
  scheduleId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSongData {
  title: string;
  artist: string;
  genre?: string;
}

export interface UpdateSong {
  title?: string;
  artist?: string;
  genre?: string | null;
}

export interface SongRepository {
  create(data: CreateSongData): Promise<Song>;
  findAll(): Promise<SongResponse[]>;
  findSongById(id: string): Promise<Song | null>;
  delete(id: string): Promise<void>;
  update(id: string, data: UpdateSong): Promise<Song | null>
}