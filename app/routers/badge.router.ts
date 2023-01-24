import { Router } from 'express';
import controller from '../controllers/badge.controller';
import handler from '../handlers/controller.handler';

const router = Router();

/**
 * @swagger
 * /badges:
 *   get:
 *     summary: Return badges
 *     description: Return all badges found in the the database without filter.
 *     tags:
 *       - Badges
 *     responses:
 *       '200':
 *         description: badges
*/
router.route('/').get(handler(controller.getAll));

/**
 * @swagger
 * /badges/{id}:
 *   get:
 *     summary: Return badge
 *     description: Return the badge corresponding to the specified id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: badge database identifier
 *     tags:
 *       - Badges
 *     responses:
 *       '200':
 *         description: badge found
 *       '404':
 *         description: badge not found
*/
router.route('/:id').get(handler(controller.getOne));

/**
 * @swagger
 * /badges/{id}/abi:
 *   get:
 *     summary: Return badge abi
 *     description: Return the badge abi corresponding to the specified badge id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: badge database identifier
 *     tags:
 *       - Badges
 *     responses:
 *       '200':
 *         description: badge abi found
 *       '404':
 *         description: badge not found
*/
router.route('/:id/abi').get(handler(controller.getAbi));
router.route('/:id/balance/:user').get(handler(controller.getBalanceOf));
router.route('/:id/uri/:token_id').get(handler(controller.getTokenUri));

router.route('/:address').post(handler(controller.add));
router.route('/:address').delete(handler(controller.remove));

export default router;