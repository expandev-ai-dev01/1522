import type { CreateSongDto } from '../../types';

/**
 * @interface SongFormProps
 * @summary Props for SongForm component
 */
export interface SongFormProps {
  onSubmit: (data: CreateSongDto) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<CreateSongDto>;
}
