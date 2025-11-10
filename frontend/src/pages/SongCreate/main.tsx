import { useNavigate } from 'react-router-dom';
import { SongForm } from '@/domain/song/components/SongForm';
import { useSongCreate } from '@/domain/song/hooks/useSongCreate';
import type { SongCreatePageProps } from './types';
import type { CreateSongDto } from '@/domain/song/types';

/**
 * @page SongCreatePage
 * @summary Page for creating new songs
 * @domain song
 * @type form-page
 * @category song-management
 *
 * @routing
 * - Path: /songs/new
 * - Guards: Authentication required
 *
 * @layout
 * - Layout: RootLayout
 * - Sections: Header, Form
 *
 * @data
 * - Sources: Song API
 * - Loading: Form submission state
 */
export const SongCreatePage = (props: SongCreatePageProps) => {
  const navigate = useNavigate();

  const { createSong, isCreating } = useSongCreate({
    onSuccess: () => {
      navigate('/');
    },
    onError: (error: Error) => {
      alert(`Erro ao criar música: ${error.message}`);
    },
  });

  const handleSubmit = async (data: CreateSongDto) => {
    try {
      await createSong(data);
    } catch (error: unknown) {
      console.error('Error creating song:', error);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nova Música</h1>
          <p className="text-gray-600">Cadastre uma nova música com letra e cifras</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <SongForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isCreating} />
        </div>
      </div>
    </div>
  );
};

export default SongCreatePage;
