/**
 * @summary
 * Song business logic services.
 * Handles all song-related database operations.
 *
 * @module services/song/songRules
 */

import { dbRequest, ExpectedReturn } from '@/utils/database';
import {
  SongCreateRequest,
  SongListRequest,
  SongGetRequest,
  SongUpdateRequest,
  SongDeleteRequest,
} from '@/services/song/songTypes';

/**
 * @function songCreate
 * @description Creates a new song with lyrics and chords
 *
 * @param {SongCreateRequest} params - Song creation parameters
 * @returns {Promise<{ idSong: number }>} Created song identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 */
export async function songCreate(params: SongCreateRequest): Promise<{ idSong: number }> {
  const result = await dbRequest(
    '[functional].[spSongCreate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      title: params.title,
      artist: params.artist,
      lyrics: params.lyrics,
      originalKey: params.originalKey,
      category: params.category,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @function songList
 * @description Lists all songs with optional filtering
 *
 * @param {SongListRequest} params - List parameters
 * @returns {Promise<Array>} Array of song objects
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function songList(params: SongListRequest): Promise<any[]> {
  const result = await dbRequest(
    '[functional].[spSongList]',
    {
      idAccount: params.idAccount,
      category: params.category,
      artist: params.artist,
      searchTerm: params.searchTerm,
    },
    ExpectedReturn.Multi
  );

  return (result as any[])[0] || [];
}

/**
 * @function songGet
 * @description Retrieves complete song details
 *
 * @param {SongGetRequest} params - Get parameters
 * @returns {Promise<object>} Song object with all details
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When song doesn't exist
 * @throws {DatabaseError} When database operation fails
 */
export async function songGet(params: SongGetRequest): Promise<any> {
  const result = await dbRequest(
    '[functional].[spSongGet]',
    {
      idAccount: params.idAccount,
      idSong: params.idSong,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @function songUpdate
 * @description Updates existing song information
 *
 * @param {SongUpdateRequest} params - Update parameters
 * @returns {Promise<{ idSong: number }>} Updated song identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When song doesn't exist
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 */
export async function songUpdate(params: SongUpdateRequest): Promise<{ idSong: number }> {
  const result = await dbRequest(
    '[functional].[spSongUpdate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idSong: params.idSong,
      title: params.title,
      artist: params.artist,
      lyrics: params.lyrics,
      originalKey: params.originalKey,
      category: params.category,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @function songDelete
 * @description Soft deletes a song
 *
 * @param {SongDeleteRequest} params - Delete parameters
 * @returns {Promise<{ idSong: number }>} Deleted song identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When song doesn't exist
 * @throws {DatabaseError} When database operation fails
 */
export async function songDelete(params: SongDeleteRequest): Promise<{ idSong: number }> {
  const result = await dbRequest(
    '[functional].[spSongDelete]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idSong: params.idSong,
    },
    ExpectedReturn.Single
  );

  return result;
}
