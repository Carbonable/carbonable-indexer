import { Router } from 'express';
import controller from '../controllers/portefolio.controller';
import handler from '../handlers/controller.handler';

const router = Router();

/**
 * @swagger
 * /portfolio/{user}:
 *   get:
 *     summary: Return user portfolio
 *     description: Return the portfolio corresponding to the specified user address.
 *     parameters:
 *       - in: path
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: User address
 *     tags:
 *       - Portfolio
 *     responses:
 *       '200':
 *         description: Portefolio computed
*/
router.route('/:user').get(handler(controller.getOne));

export default router;