import { Router } from 'express';
import controller from '../controllers/offseter.controller';
import handler from '../handlers/controller.handler';
import { verify } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /offseters:
 *   get:
 *     summary: Return the offseters
 *     description: Return all the offseters found in the the database without filter.
 *     tags:
 *       - Offseters
 *     responses:
 *       '200':
 *         description: Offseters
*/
router.route('/').get(handler(controller.getAll));

/**
 * @swagger
 * /offseters/{id}:
 *   get:
 *     summary: Return the offseter
 *     description: Return the offseter corresponding to the specified id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Offseter database identifier
 *     tags:
 *       - Offseters
 *     responses:
 *       '200':
 *         description: Offseter found
 *       '404':
 *         description: Offseter not found
*/
router.route('/:id').get(handler(controller.getOne));

/**
 * @swagger
 * /offseters/{id}/abi:
 *   get:
 *     summary: Return the offseter abi
 *     description: Return the offseter abi corresponding to the specified offseter id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Offseter database identifier
 *     tags:
 *       - Offseters
 *     responses:
 *       '200':
 *         description: Offseter abi found
 *       '404':
 *         description: Offseter not found
*/
router.route('/:id/abi').get(handler(controller.getAbi));

/**
 * @swagger
 * /offseters/{address}:
 *   post:
 *     summary: Create a new offseter
 *     description: Create a offseter corresponding to the specified address.
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Offseter contract address
 *     tags:
 *       - Offseters
 *     responses:
 *       '201':
 *         description: Offseter created
 *       '209':
 *         description: Offseter already recorded
 *       '500':
 *         description: Contract not found
*/
router.route('/:address').post(verify, handler(controller.add));

/**
 * @swagger
 * /offseters/{address}:
 *   delete:
 *     summary: Delete a offseter
 *     description: Delete a offseter corresponding to the specified address.
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Offseter contract address
 *     tags:
 *       - Offseters
 *     responses:
 *       '200':
 *         description: Offseter deleted
 *       '404':
 *         description: Offseter not found
 *       '500':
 *         description: Contract not found
*/
router.route('/:address').delete(verify, handler(controller.remove));

export default router;