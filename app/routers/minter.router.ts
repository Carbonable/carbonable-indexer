import { Router } from 'express';
import controller from '../controllers/minter.controller';
import handler from '../handlers/controller.handler';

const router = Router();

/**
 * @swagger
 * /minters:
 *   get:
 *     summary: Return the minters
 *     description: Return all the minters found in the the database without filter.
 *     tags:
 *       - Minters
 *     responses:
 *       '200':
 *         description: Minters
*/
router.route('/').get(handler(controller.getAll));

/**
 * @swagger
 * /minters/{id}:
 *   get:
 *     summary: Return the minter
 *     description: Return the minter corresponding to the specified id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Minter database identifier
 *     tags:
 *       - Minters
 *     responses:
 *       '200':
 *         description: Minter found
 *       '404':
 *         description: Minter not found
*/
router.route('/:id').get(handler(controller.getOne));

/**
 * @swagger
 * /minters/{id}/abi:
 *   get:
 *     summary: Return the minter abi
 *     description: Return the minter abi corresponding to the specified minter id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Minter database identifier
 *     tags:
 *       - Minters
 *     responses:
 *       '200':
 *         description: Minter abi found
 *       '404':
 *         description: Minter not found
*/
router.route('/:id/abi').get(handler(controller.getAbi));

/**
 * @swagger
 * /minters/{id}/claimed/{user}:
 *   get:
 *     summary: Return the minter claimed slots of a user
 *     description: Return the minter claimed slots corresponding to the specified minter id of a user.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Minter database identifier
 *       - in: path
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: User address
 *     tags:
 *       - Minters
 *     responses:
 *       '200':
 *         description: Minter claimed slots found
 *       '404':
 *         description: Minter not found
*/
router.route('/:id/claimed/:user').get(handler(controller.getClaimedSlots));

/**
 * @swagger
 * /minters/{id}/whitelist/{user}:
 *   get:
 *     summary: Return the minter whitelist slots of a user
 *     description: Return the minter whitelist slots corresponding to the specified minter id of a user.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Minter database identifier
 *       - in: path
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: User address
 *     tags:
 *       - Minters
 *     responses:
 *       '200':
 *         description: Minter whitelist slots found
 *       '404':
 *         description: Minter or Whitelist not found or User not found in whitelist
*/
router.route('/:id/whitelist/:user').get(handler(controller.getWhitelistedSlots));

/**
 * @swagger
 * /minters/{id}/whitelist:
 *   get:
 *     summary: Return the minter whitelist
 *     description: Return the minter whitelist corresponding to the specified minter id of a user.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Minter database identifier
 *     tags:
 *       - Minters
 *     responses:
 *       '200':
 *         description: Minter whitelist
 *       '404':
 *         description: Minter not found
*/
router.route('/:id/whitelist').get(handler(controller.getWhitelist));

/**
 * @swagger
 * /minters/{id}/whitelist:
 *   post:
 *     summary: Set the minter whitelist
 *     description: Set and return the minter whitelist corresponding to the specified minter id of a user.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Minter database identifier
 *       - in: body
 *         name: whitelist
 *         schema:
 *           type: object
 *         required: true
 *         description: Minter whitelist
 *     tags:
 *       - Minters
 *     responses:
 *       '200':
 *         description: Minter whitelist
 *       '404':
 *         description: Minter not found
 *       '422':
 *         description: Whitelist input is missing
*/
router.route('/:id/whitelist').post(handler(controller.setWhitelist));

/**
 * @swagger
 * /minters/{address}:
 *   post:
 *     summary: Create a new minter
 *     description: Create a minter corresponding to the specified address.
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Minter contract address
 *     tags:
 *       - Minters
 *     responses:
 *       '201':
 *         description: Minter created
 *       '209':
 *         description: Minter already recorded
 *       '500':
 *         description: Contract not found
*/
router.route('/:address').post(handler(controller.add));

/**
 * @swagger
 * /minters/{address}:
 *   delete:
 *     summary: Delete a minter
 *     description: Delete a minter corresponding to the specified address.
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Minter contract address
 *     tags:
 *       - Minters
 *     responses:
 *       '200':
 *         description: Minter deleted
 *       '404':
 *         description: Minter not found
 *       '500':
 *         description: Contract not found
*/
router.route('/:address').delete(handler(controller.remove));

export default router;