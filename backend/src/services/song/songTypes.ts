/**
 * @summary
 * Song service type definitions.
 * Defines interfaces for song-related operations.
 *
 * @module services/song/songTypes
 */

/**
 * @interface SongCreateRequest
 * @description Parameters for creating a new song
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {string} title - Song title
 * @property {string} artist - Artist name
 * @property {string} lyrics - Song lyrics with chords
 * @property {string | null} [originalKey] - Original musical key
 * @property {string | null} [category] - Musical category
 */
export interface SongCreateRequest {
  idAccount: number;
  idUser: number;
  title: string;
  artist: string;
  lyrics: string;
  originalKey?: string | null;
  category?: string | null;
}

/**
 * @interface SongListRequest
 * @description Parameters for listing songs
 *
 * @property {number} idAccount - Account identifier
 * @property {string | null} [category] - Filter by category
 * @property {string | null} [artist] - Filter by artist
 * @property {string | null} [searchTerm] - Search term
 */
export interface SongListRequest {
  idAccount: number;
  category?: string | null;
  artist?: string | null;
  searchTerm?: string | null;
}

/**
 * @interface SongGetRequest
 * @description Parameters for retrieving a song
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idSong - Song identifier
 */
export interface SongGetRequest {
  idAccount: number;
  idSong: number;
}

/**
 * @interface SongUpdateRequest
 * @description Parameters for updating a song
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} idSong - Song identifier
 * @property {string} title - Song title
 * @property {string} artist - Artist name
 * @property {string} lyrics - Song lyrics with chords
 * @property {string | null} [originalKey] - Original musical key
 * @property {string | null} [category] - Musical category
 */
export interface SongUpdateRequest {
  idAccount: number;
  idUser: number;
  idSong: number;
  title: string;
  artist: string;
  lyrics: string;
  originalKey?: string | null;
  category?: string | null;
}

/**
 * @interface SongDeleteRequest
 * @description Parameters for deleting a song
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} idSong - Song identifier
 */
export interface SongDeleteRequest {
  idAccount: number;
  idUser: number;
  idSong: number;
}

/**
 * @interface SongEntity
 * @description Song entity structure
 *
 * @property {number} idSong - Song identifier
 * @property {number} idAccount - Account identifier
 * @property {string} title - Song title
 * @property {string} artist - Artist name
 * @property {string} lyrics - Song lyrics with chords
 * @property {string | null} originalKey - Original musical key
 * @property {string | null} category - Musical category
 * @property {Date} dateCreated - Creation timestamp
 * @property {Date} dateModified - Last modification timestamp
 * @property {boolean} deleted - Soft delete flag
 */
export interface SongEntity {
  idSong: number;
  idAccount: number;
  title: string;
  artist: string;
  lyrics: string;
  originalKey: string | null;
  category: string | null;
  dateCreated: Date;
  dateModified: Date;
  deleted: boolean;
}
