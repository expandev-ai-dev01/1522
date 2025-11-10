/**
 * @summary
 * Song controller for CRUD operations.
 * Handles HTTP requests for song management.
 *
 * @module api/v1/internal/song/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { songCreate, songList, songGet, songUpdate, songDelete } from '@/services/song';
import { zName, zNullableString } from '@/utils/zodValidation';

const securable = 'SONG';

/**
 * @api {get} /api/v1/internal/song List Songs
 * @apiName ListSongs
 * @apiGroup Song
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists all songs with optional filtering
 *
 * @apiParam {String} [category] Filter by category
 * @apiParam {String} [artist] Filter by artist
 * @apiParam {String} [searchTerm] Search in title, artist, or lyrics
 *
 * @apiSuccess {Array} songs Array of song objects
 *
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const querySchema = z.object({
    category: zNullableString(50).optional(),
    artist: zNullableString(200).optional(),
    searchTerm: zNullableString(200).optional(),
  });

  const [validated, error] = await operation.read(req, querySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await songList({
      ...validated.credential,
      category: validated.params.category || null,
      artist: validated.params.artist || null,
      searchTerm: validated.params.searchTerm || null,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {post} /api/v1/internal/song Create Song
 * @apiName CreateSong
 * @apiGroup Song
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new song with lyrics and chords
 *
 * @apiParam {String} title Song title (max 200 characters)
 * @apiParam {String} artist Artist name (max 200 characters)
 * @apiParam {String} lyrics Song lyrics with chords
 * @apiParam {String} [originalKey] Original musical key (max 10 characters)
 * @apiParam {String} [category] Musical category (max 50 characters)
 *
 * @apiSuccess {Number} idSong Created song identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const bodySchema = z.object({
    title: zName,
    artist: zName,
    lyrics: z.string().min(1).max(5000),
    originalKey: zNullableString(10).nullable(),
    category: zNullableString(50).nullable(),
  });

  const [validated, error] = await operation.create(req, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await songCreate({
      ...validated.credential,
      ...validated.params,
    });

    res.status(201).json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /api/v1/internal/song/:id Get Song
 * @apiName GetSong
 * @apiGroup Song
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves complete song details
 *
 * @apiParam {Number} id Song identifier
 *
 * @apiSuccess {Object} song Song object with all details
 *
 * @apiError {String} NotFoundError Song not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const [validated, error] = await operation.read(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await songGet({
      ...validated.credential,
      idSong: validated.params.id,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {put} /api/v1/internal/song/:id Update Song
 * @apiName UpdateSong
 * @apiGroup Song
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates existing song information
 *
 * @apiParam {Number} id Song identifier
 * @apiParam {String} title Song title (max 200 characters)
 * @apiParam {String} artist Artist name (max 200 characters)
 * @apiParam {String} lyrics Song lyrics with chords
 * @apiParam {String} [originalKey] Original musical key (max 10 characters)
 * @apiParam {String} [category] Musical category (max 50 characters)
 *
 * @apiSuccess {Number} idSong Updated song identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} NotFoundError Song not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const bodySchema = z.object({
    title: zName,
    artist: zName,
    lyrics: z.string().min(1).max(5000),
    originalKey: zNullableString(10).nullable(),
    category: zNullableString(50).nullable(),
  });

  const combinedSchema = paramsSchema.merge(bodySchema);

  const [validated, error] = await operation.update(req, combinedSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await songUpdate({
      ...validated.credential,
      idSong: validated.params.id,
      title: validated.params.title,
      artist: validated.params.artist,
      lyrics: validated.params.lyrics,
      originalKey: validated.params.originalKey,
      category: validated.params.category,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {delete} /api/v1/internal/song/:id Delete Song
 * @apiName DeleteSong
 * @apiGroup Song
 * @apiVersion 1.0.0
 *
 * @apiDescription Soft deletes a song
 *
 * @apiParam {Number} id Song identifier
 *
 * @apiSuccess {Number} idSong Deleted song identifier
 *
 * @apiError {String} NotFoundError Song not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const [validated, error] = await operation.delete(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await songDelete({
      ...validated.credential,
      idSong: validated.params.id,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
