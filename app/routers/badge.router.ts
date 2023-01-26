import { Router } from 'express';
import controller from '../controllers/badge.controller';
import handler from '../handlers/controller.handler';
import { verify } from '../middlewares/auth.middleware';

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

/**
 * @swagger
 * /badges/{id}/balance/{user}:
 *   get:
 *     summary: Return the badge balance of user
 *     description: Return the badge token balance corresponding to the specified badge id of user.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Badge database identifier
 *       - in: path
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: User address
 *     tags:
 *       - Badges
 *     responses:
 *       '200':
 *         description: Badge tokens found
 *       '404':
 *         description: Badge not found
*/
router.route('/:id/balance/:user').get(handler(controller.getBalanceOf));

/**
 * @swagger
 * /badges/{id}/owner/{token_id}:
 *   get:
 *     summary: Return the badge token owner
 *     description: Return the badge token owner corresponding to the specified badge id of token.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Badge database identifier
 *       - in: path
 *         name: token_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Token blockchain identifier
 *     tags:
 *       - Badges
 *     responses:
 *       '200':
 *         description: Badge token owner found
 *       '404':
 *         description: Badge not found
*/
router.route('/:id/uri/:token_id').get(handler(controller.getTokenUri));

/**
 * @swagger
 * /badges/{id}/transfers:
 *   get:
 *     summary: Return the badge token transfers
 *     description: Return the badge token transfers corresponding to the specified badge id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Badge database identifier
 *     tags:
 *       - Badges
 *     responses:
 *       '200':
 *         description: Badge token transfers found
 *       '404':
 *         description: Badge not found
*/
router.route('/:id/transfers').get(handler(controller.getTransfers));

/**
 * @swagger
 * /badges/{address}:
 *   post:
 *     summary: Create a new badge
 *     description: Create a badge corresponding to the specified address.
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Badge contract address
 *     tags:
 *       - Badges
 *     responses:
 *       '201':
 *         description: Badge created
 *       '209':
 *         description: Badge already recorded
 *       '500':
 *         description: Contract not found
*/
router.route('/:address').post(verify, handler(controller.add));

/**
 * @swagger
 * /badges/{address}:
 *   delete:
 *     summary: Delete a badge
 *     description: Delete a badge corresponding to the specified address.
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Badge contract address
 *     tags:
 *       - Badges
 *     responses:
 *       '200':
 *         description: Badge deleted
 *       '404':
 *         description: Badge not found
 *       '500':
 *         description: Contract not found
*/
router.route('/:address').delete(verify, handler(controller.remove));

export default router;