import { Router } from 'express';
import controller from '../controllers/payment.controller';
import handler from '../handlers/controller.handler';

const router = Router();

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Return the payments
 *     description: Return all the payments found in the the database without filter.
 *     tags:
 *       - Payments
 *     responses:
 *       '200':
 *         description: Payments
*/
router.route('/').get(handler(controller.getAll));

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Return the payment
 *     description: Return the payment corresponding to the specified id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Payment database identifier
 *     tags:
 *       - Payments
 *     responses:
 *       '200':
 *         description: Payment found
 *       '404':
 *         description: Payment not found
*/
router.route('/:id').get(handler(controller.getOne));

/**
 * @swagger
 * /payments/{id}/abi:
 *   get:
 *     summary: Return the payment abi
 *     description: Return the payment abi corresponding to the specified payment id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Payment database identifier
 *     tags:
 *       - Payments
 *     responses:
 *       '200':
 *         description: Payment abi found
 *       '404':
 *         description: Payment not found
*/
router.route('/:id/abi').get(handler(controller.getAbi));

export default router;