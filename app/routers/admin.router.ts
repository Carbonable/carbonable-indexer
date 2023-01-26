import { Router } from 'express';
import mainController from '../controllers/main.controller';
import controller from '../controllers/admin.controller';
import { generate, verify } from '../middlewares/auth.middleware';
import handler from '../handlers/controller.handler';

const router = Router();

/**
 * @swagger
 * /admin/restart:
 *   post:
 *     summary: Restart the blockchain stream
 *     description: Update the config of the apibara indexer by setting the block cursor to the first block.
 *     parameters:
 *       - in: body
 *         name: token
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *         required: true
 *         description: authentication token
 *     tags:
 *       - Admin
 *     responses:
 *       '200':
 *         description: Stream restarted
*/
router.route('/restart').post(verify, handler(mainController.restart));

/**
 * @swagger
 * /admin/token:
 *   post:
 *     summary: Generate JWT
 *     description: Create a new JWT.
 *     parameters:
 *       - in: path
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: user associated to the new token
 *       - in: body
 *         name: token
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *         required: true
 *         description: authentication token
 *     tags:
 *       - Admin
 *     responses:
 *       '201':
 *         description: Token created
*/
router.route('/token').post(verify, handler(generate));

/**
 * @swagger
 * /admin/verify:
 *   post:
 *     summary: Verify JWT
 *     description: Verify the specified JWT.
 *     parameters:
 *       - in: body
 *         name: token
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *         required: true
 *         description: authentication token
 *     tags:
 *       - Admin
 *     responses:
 *       '404':
 *         description: Successfully authenticated
 *       '401':
 *         description: Invalid authentication token
*/
router.route('/verify').post(handler(verify));

/**
 * @swagger
 * /admin/create/badge={badge}&project={project}&minter={minter}&vester={vester}&offseter={offseter}&yielder={yielder}:
 *   post:
 *     summary: Add multi contracts to the database
 *     description: Add all contracts to the database.
 *     parameters:
 *       - in: path
 *         name: badge
 *         schema:
 *           type: string
 *         required: false
 *         description: badge address
 *       - in: path
 *         name: project
 *         schema:
 *           type: string
 *         required: false
 *         description: project address
 *       - in: path
 *         name: minter
 *         schema:
 *           type: string
 *         required: false
 *         description: minter address
 *       - in: path
 *         name: vester
 *         schema:
 *           type: string
 *         required: false
 *         description: vester address
 *       - in: path
 *         name: offseter
 *         schema:
 *           type: string
 *         required: false
 *         description: offseter address
 *       - in: path
 *         name: yielder
 *         schema:
 *           type: string
 *         required: false
 *         description: yielder address
 *       - in: body
 *         name: token
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *         required: true
 *         description: authentication token
 *     tags:
 *       - Admin
 *     responses:
 *       '200':
 *         description: Creations run successfully
*/
router
    .route('/create/badge=:badge&project=:project&minter=:minter&vester=:vester&offseter=:offseter&yielder=:yielder')
    .post(verify, handler(controller.create));

export default router;