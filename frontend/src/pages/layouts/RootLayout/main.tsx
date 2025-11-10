import { Outlet } from 'react-router-dom';
import type { RootLayoutProps } from './types';

/**
 * @component RootLayout
 * @summary Root layout wrapper for all pages
 * @domain core
 * @type layout-component
 * @category layout
 */
export const RootLayout = (props: RootLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};

export default RootLayout;
