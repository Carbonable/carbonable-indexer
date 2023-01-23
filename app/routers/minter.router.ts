import { Router } from 'express';
import controller from '../controllers/minter.controller';
import handler from '../handlers/controller.handler';

const router = Router();

/**
 * @swagger
 * /minters:
 *   get:
 *     summary: Return minters
 *     description: Return all minters found in the the database without filter.
 *     tags:
 *       - minters
*/
router.route('/').get(handler(controller.getAll));

/**
 * @swagger
 * /minters/{id}:
 *   get:
 *     summary: Return one project
 *     description: Return the project corresponding to the specified id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project database identifier
 *     tags:
 *       - minters
*/
router.route('/:id').get(handler(controller.getOne));
router.route('/:id/abi').get(handler(controller.getAbi));
router.route('/:id/whitelist?whitelist_id=:whitelist_id').get(handler(controller.getWhitelistedSlots));
router.route('/:id/claimed?user=:user').get(handler(controller.getClaimedSlots));

router.route('/:address').post(handler(controller.add));
router.route('/:address').delete(handler(controller.remove));

export default router;