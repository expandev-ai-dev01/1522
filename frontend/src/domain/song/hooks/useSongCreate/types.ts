import type { CreateSongDto, Song } from '../../types';

/**
 * @interface UseSongCreateOptions
 * @summary Options for useSongCreate hook
 */
export interface UseSongCreateOptions {
  onSuccess?: (song: Song) => void;
  onError?: (error: Error) => void;
}

/**
 * @interface UseSongCreateReturn
 * @summary Return type for useSongCreate hook
 */
export interface UseSongCreateReturn {
  createSong: (data: CreateSongDto) => Promise<Song>;
  isCreating: boolean;
  error: Error | null;
}
