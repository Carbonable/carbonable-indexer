import { Router } from 'express';
import controller from '../controllers/vester.controller';
import handler from '../handlers/controller.handler';
import { verify } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /vesters:
 *   get:
 *     summary: Return the vesters
 *     description: Return all the vesters found in the the database without filter.
 *     tags:
 *       - Vesters
 *     responses:
 *       '200':
 *         description: Vesters
*/
router.route('/').get(handler(controller.getAll));

/**
 * @swagger
 * /vesters/{id}:
 *   get:
 *     summary: Return the vester
 *     description: Return the vester corresponding to the specified id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Vester database identifier
 *     tags:
 *       - Vesters
 *     responses:
 *       '200':
 *         description: Vester found
 *       '404':
 *         description: Vester not found
*/
router.route('/:id').get(handler(controller.getOne));

/**
 * @swagger
 * /vesters/{id}/abi:
 *   get:
 *     summary: Return the vester abi
 *     description: Return the vester abi corresponding to the specified vester id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Vester database identifier
 *     tags:
 *       - Vesters
 *     responses:
 *       '200':
 *         description: Vester abi found
 *       '404':
 *         description: Vester not found
*/
router.route('/:id/abi').get(handler(controller.getAbi));

/**
 * @swagger
 * /vesters/{address}:
 *   post:
 *     summary: Create a new vester
 *     description: Create a vester corresponding to the specified address.
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Vester contract address
 *     tags:
 *       - Vesters
 *     responses:
 *       '201':
 *         description: Vester created
 *       '209':
 *         description: Vester already recorded
 *       '500':
 *         description: Contract not found
*/
router.route('/:address').post(verify, handler(controller.add));

/**
 * @swagger
 * /vesters/{address}:
 *   delete:
 *     summary: Delete a vester
 *     description: Delete a vester corresponding to the specified address.
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Vester contract address
 *     tags:
 *       - Vesters
 *     responses:
 *       '200':
 *         description: Vester deleted
 *       '404':
 *         description: Vester not found
 *       '500':
 *         description: Contract not found
*/
router.route('/:address').delete(verify, handler(controller.remove));

export default router;