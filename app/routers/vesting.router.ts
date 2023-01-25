import { Router } from 'express';
import controller from '../controllers/vesting.controller';
import handler from '../handlers/controller.handler';

const router = Router();

/**
 * @swagger
 * /vestings:
 *   get:
 *     summary: Return the vestings
 *     description: Return all the vestings found in the the database without filter.
 *     tags:
 *       - Vestings
 *     responses:
 *       '200':
 *         description: Vestings
*/
router.route('/').get(handler(controller.getAll));

/**
 * @swagger
 * /vestings/{id}:
 *   get:
 *     summary: Return the vesting
 *     description: Return the vesting corresponding to the specified id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Vesting database identifier
 *     tags:
 *       - Vestings
 *     responses:
 *       '200':
 *         description: Vesting found
 *       '404':
 *         description: Vesting not found
*/
router.route('/:id').get(handler(controller.getOne));

export default router;