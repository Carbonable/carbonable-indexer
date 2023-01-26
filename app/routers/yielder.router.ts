import { Router } from 'express';
import controller from '../controllers/yielder.controller';
import handler from '../handlers/controller.handler';
import { verify } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /yielders:
 *   get:
 *     summary: Return the yielders
 *     description: Return all the yielders found in the the database without filter.
 *     tags:
 *       - Yielders
 *     responses:
 *       '200':
 *         description: Yielders
*/
router.route('/').get(handler(controller.getAll));

/**
 * @swagger
 * /yielders/{id}:
 *   get:
 *     summary: Return the yielder
 *     description: Return the yielder corresponding to the specified id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Yielder database identifier
 *     tags:
 *       - Yielders
 *     responses:
 *       '200':
 *         description: Yielder found
 *       '404':
 *         description: Yielder not found
*/
router.route('/:id').get(handler(controller.getOne));

/**
 * @swagger
 * /yielders/{id}/abi:
 *   get:
 *     summary: Return the yielder abi
 *     description: Return the yielder abi corresponding to the specified yielder id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Yielder database identifier
 *     tags:
 *       - Yielders
 *     responses:
 *       '200':
 *         description: Yielder abi found
 *       '404':
 *         description: Yielder not found
*/
router.route('/:id/abi').get(handler(controller.getAbi));

/**
 * @swagger
 * /yielders/{id}/apr:
 *   get:
 *     summary: Return the yielder instantaneous apr
 *     description: Return the yielder instantaneous apr corresponding to the specified yielder id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Yielder database identifier
 *     tags:
 *       - Yielders
 *     responses:
 *       '200':
 *         description: Yielder apr computed
 *       '404':
 *         description: Yielder not found
*/
router.route('/:id/apr').get(handler(controller.getApr));

/**
 * @swagger
 * /yielders/{address}:
 *   post:
 *     summary: Create a new yielder
 *     description: Create a yielder corresponding to the specified address.
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Yielder contract address
 *     tags:
 *       - Yielders
 *     responses:
 *       '201':
 *         description: Yielder created
 *       '209':
 *         description: Yielder already recorded
 *       '500':
 *         description: Contract not found
*/
router.route('/:address').post(verify, handler(controller.add));

/**
 * @swagger
 * /yielders/{address}:
 *   delete:
 *     summary: Delete a yielder
 *     description: Delete a yielder corresponding to the specified address.
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Yielder contract address
 *     tags:
 *       - Yielders
 *     responses:
 *       '200':
 *         description: Yielder deleted
 *       '404':
 *         description: Yielder not found
 *       '500':
 *         description: Contract not found
*/
router.route('/:address').delete(verify, handler(controller.remove));

export default router;