import { useMutation, useQueryClient } from '@tanstack/react-query';
import { songService } from '../../services/songService';
import type { UseSongCreateOptions, UseSongCreateReturn } from './types';
import type { CreateSongDto } from '../../types';

/**
 * @hook useSongCreate
 * @summary Hook for creating new songs
 * @domain song
 * @type domain-hook
 * @category data
 */
export const useSongCreate = (options: UseSongCreateOptions = {}): UseSongCreateReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateSongDto) => songService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    createSong: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
