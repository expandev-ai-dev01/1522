import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { SongFormProps } from './types';
import type { CreateSongDto } from '../../types';

const songSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  artist: z.string().min(1, 'Artista é obrigatório').max(200, 'Nome do artista muito longo'),
  lyrics: z.string().min(1, 'Letra é obrigatória').max(5000, 'Letra muito longa'),
  originalKey: z.string().max(10, 'Tom muito longo').nullable().optional(),
  category: z.string().max(50, 'Categoria muito longa').nullable().optional(),
});

/**
 * @component SongForm
 * @summary Form for creating/editing songs with validation
 * @domain song
 * @type domain-component
 * @category form
 */
export const SongForm = (props: SongFormProps) => {
  const { onSubmit, onCancel, isSubmitting = false, initialData } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSongDto>({
    resolver: zodResolver(songSchema),
    defaultValues: initialData || {
      title: '',
      artist: '',
      lyrics: '',
      originalKey: null,
      category: null,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Título *
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-2">
          Artista *
        </label>
        <input
          id="artist"
          type="text"
          {...register('artist')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        {errors.artist && <p className="mt-1 text-sm text-red-600">{errors.artist.message}</p>}
      </div>

      <div>
        <label htmlFor="originalKey" className="block text-sm font-medium text-gray-700 mb-2">
          Tom Original
        </label>
        <input
          id="originalKey"
          type="text"
          {...register('originalKey')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: C, Am, G"
          disabled={isSubmitting}
        />
        {errors.originalKey && (
          <p className="mt-1 text-sm text-red-600">{errors.originalKey.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Categoria
        </label>
        <input
          id="category"
          type="text"
          {...register('category')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: Gospel, MPB, Rock"
          disabled={isSubmitting}
        />
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
      </div>

      <div>
        <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700 mb-2">
          Letra com Cifras *
        </label>
        <textarea
          id="lyrics"
          {...register('lyrics')}
          rows={12}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          placeholder="Digite a letra da música com as cifras acima das palavras"
          disabled={isSubmitting}
        />
        {errors.lyrics && <p className="mt-1 text-sm text-red-600">{errors.lyrics.message}</p>}
      </div>

      <div className="flex gap-4 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Música'}
        </button>
      </div>
    </form>
  );
};
