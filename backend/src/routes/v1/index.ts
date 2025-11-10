/**
 * @summary
 * V1 API router configuration.
 * Separates external (public) and internal (authenticated) routes.
 *
 * @module routes/v1
 */

import { Router } from 'express';
import externalRoutes from '@/routes/v1/externalRoutes';
import internalRoutes from '@/routes/v1/internalRoutes';

const router = Router();

/**
 * @rule {be-external-routes}
 * External (public) routes - /api/v1/external/...
 */
router.use('/external', externalRoutes);

/**
 * @rule {be-internal-routes}
 * Internal (authenticated) routes - /api/v1/internal/...
 */
router.use('/internal', internalRoutes);

export default router;
