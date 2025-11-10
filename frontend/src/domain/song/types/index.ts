/**
 * @module domain/song/types
 * @summary Type definitions for song domain
 */

export interface Song {
  idSong: number;
  title: string;
  artist: string;
  lyrics: string;
  originalKey: string | null;
  category: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSongDto {
  title: string;
  artist: string;
  lyrics: string;
  originalKey?: string | null;
  category?: string | null;
}

export interface UpdateSongDto {
  title: string;
  artist: string;
  lyrics: string;
  originalKey?: string | null;
  category?: string | null;
}

export interface SongListParams {
  category?: string | null;
  artist?: string | null;
  searchTerm?: string | null;
}
