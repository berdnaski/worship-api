export interface SongVersion {
  id: string;
  versionName: string;
  songId: string; 
  classification: string;
  key: string;
  linkChord: string | null; 
  linkVideo: string | null;  
  createdAt: Date;
  updatedAt: Date;
}

export interface SongVersionCreate {
  versionName: string;
  classification: string;
  key: string;
  linkChord?: string | null;
  linkVideo?: string | null;
}

export interface CreateSongVersionRequestBody {
  versionName: string;
  classification: string;
  key: string;
  linkChord?: string | null;
  linkVideo?: string | null;
}

export interface SongVersionUpdate {
  versionName?: string;
  classification?: string;
  key?: string;
  linkChord?: string | null;
  linkVideo?: string | null;
}

export interface SongVersionResponse {
  versionName: string;
  classification: string;
  key: string;
  linkChord?: string | null;
  linkVideo?: string | null;
}


export interface SongVersionRepository {
  create(data: SongVersionCreate, songId: string): Promise<SongVersion>
  findAll(): Promise<SongVersionResponse[]>;
  findById(id: string): Promise<SongVersion | null>;
  delete(id: string): Promise<void>;
  update(id: string, data: SongVersionUpdate): Promise<SongVersion | null>;
}
