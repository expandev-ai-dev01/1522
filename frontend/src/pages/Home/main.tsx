import type { HomePageProps } from './types';

/**
 * @page HomePage
 * @summary Home page - welcome screen
 * @domain core
 * @type landing-page
 * @category public
 */
export const HomePage = (props: HomePageProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Editor de Música Cifrada</h1>
      <p className="text-lg text-gray-600 text-center max-w-2xl">
        Catálogo de músicas contendo a letra da música e as cifras dos acordes
      </p>
    </div>
  );
};

export default HomePage;
