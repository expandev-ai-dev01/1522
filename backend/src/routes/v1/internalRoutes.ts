/**
 * @summary
 * Internal API routes configuration for V1.
 * Handles authenticated endpoints that require user authentication.
 *
 * @module routes/v1/internalRoutes
 */

import { Router } from 'express';
import * as songController from '@/api/v1/internal/song/controller';

const router = Router();

/**
 * @rule {be-song-routes}
 * Song management routes - /api/v1/internal/song
 */
router.get('/song', songController.listHandler);
router.post('/song', songController.createHandler);
router.get('/song/:id', songController.getHandler);
router.put('/song/:id', songController.updateHandler);
router.delete('/song/:id', songController.deleteHandler);

export default router;
