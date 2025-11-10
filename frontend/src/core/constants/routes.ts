/**
 * @module core/constants/routes
 * @summary Application route constants
 */

export const ROUTES = {
  HOME: '/',
  SONGS: {
    LIST: '/songs',
    CREATE: '/songs/new',
    DETAIL: (id: number | string) => `/songs/${id}`,
    EDIT: (id: number | string) => `/songs/${id}/edit`,
  },
  PLAYLISTS: {
    LIST: '/playlists',
    CREATE: '/playlists/new',
    DETAIL: (id: number | string) => `/playlists/${id}`,
    EDIT: (id: number | string) => `/playlists/${id}/edit`,
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOT_FOUND: '*',
} as const;
