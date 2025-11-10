import { authenticatedClient } from '@/core/lib/api';
import type { Song, CreateSongDto, UpdateSongDto, SongListParams } from '../types';
import type { ApiResponse } from '@/core/types';

/**
 * @service songService
 * @summary Song management service for authenticated endpoints
 * @domain song
 * @type rest-service
 * @apiContext internal
 *
 * @description
 * All methods in this service use authenticatedClient which targets:
 * /api/v1/internal/song/...
 *
 * Authentication token is automatically added by interceptor.
 */
export const songService = {
  /**
   * @endpoint GET /api/v1/internal/song
   * @summary Fetches list of songs with filters
   */
  async list(params?: SongListParams): Promise<Song[]> {
    const response = await authenticatedClient.get<ApiResponse<Song[]>>('/song', { params });
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/song/:id
   * @summary Fetches single song by ID
   */
  async getById(id: number): Promise<Song> {
    const response = await authenticatedClient.get<ApiResponse<Song>>(`/song/${id}`);
    return response.data.data;
  },

  /**
   * @endpoint POST /api/v1/internal/song
   * @summary Creates new song
   */
  async create(data: CreateSongDto): Promise<Song> {
    const response = await authenticatedClient.post<ApiResponse<{ idSong: number }>>('/song', data);
    return { ...data, idSong: response.data.data.idSong } as Song;
  },

  /**
   * @endpoint PUT /api/v1/internal/song/:id
   * @summary Updates existing song
   */
  async update(id: number, data: UpdateSongDto): Promise<Song> {
    const response = await authenticatedClient.put<ApiResponse<{ idSong: number }>>(
      `/song/${id}`,
      data
    );
    return { ...data, idSong: response.data.data.idSong } as Song;
  },

  /**
   * @endpoint DELETE /api/v1/internal/song/:id
   * @summary Deletes song
   */
  async delete(id: number): Promise<void> {
    await authenticatedClient.delete(`/song/${id}`);
  },
};
