/**
 * @module core/constants/api
 * @summary API-related constants
 */

export const API_ENDPOINTS = {
  SONGS: '/song',
  PLAYLISTS: '/playlist',
  USERS: '/user',
  AUTH: {
    LOGIN: '/security/login',
    REGISTER: '/security/register',
    LOGOUT: '/security/logout',
    REFRESH: '/security/refresh',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const QUERY_KEYS = {
  SONGS: 'songs',
  SONG_DETAIL: 'song-detail',
  PLAYLISTS: 'playlists',
  PLAYLIST_DETAIL: 'playlist-detail',
  USER_PROFILE: 'user-profile',
} as const;
