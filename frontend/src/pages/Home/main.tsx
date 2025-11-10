import { useNavigate } from 'react-router-dom';
import type { HomePageProps } from './types';

/**
 * @page HomePage
 * @summary Home page - welcome screen
 * @domain core
 * @type landing-page
 * @category public
 */
export const HomePage = (props: HomePageProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Editor de Música Cifrada</h1>
      <p className="text-lg text-gray-600 text-center max-w-2xl mb-8">
        Catálogo de músicas contendo a letra da música e as cifras dos acordes
      </p>
      <button
        onClick={() => navigate('/songs/new')}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Cadastrar Nova Música
      </button>
    </div>
  );
};

export default HomePage;
