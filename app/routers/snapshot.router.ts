import { Router } from 'express';
import controller from '../controllers/snapshot.controller';
import handler from '../handlers/controller.handler';

const router = Router();

/**
 * @swagger
 * /snapshots:
 *   get:
 *     summary: Return the snapshots
 *     description: Return all the snapshots found in the the database without filter.
 *     tags:
 *       - Snapshots
 *     responses:
 *       '200':
 *         description: Snapshots
*/
router.route('/').get(handler(controller.getAll));

/**
 * @swagger
 * /snapshots/{id}:
 *   get:
 *     summary: Return the snapshot
 *     description: Return the snapshot corresponding to the specified id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Snapshot database identifier
 *     tags:
 *       - Snapshots
 *     responses:
 *       '200':
 *         description: Snapshot found
 *       '404':
 *         description: Snapshot not found
*/
router.route('/:id').get(handler(controller.getOne));

export default router;