import { Router } from 'express';
import controller from '../controllers/project.controller';
import handler from '../handlers/controller.handler';
import { verify } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Return the projects
 *     description: Return all the projects found in the the database without filter.
 *     tags:
 *       - Projects
 *     responses:
 *       '200':
 *         description: Projects
*/
router.route('/').get(handler(controller.getAll));

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Return the project
 *     description: Return the project corresponding to the specified id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project database identifier
 *     tags:
 *       - Projects
 *     responses:
 *       '200':
 *         description: Project found
 *       '404':
 *         description: Project not found
*/
router.route('/:id').get(handler(controller.getOne));

/**
 * @swagger
 * /projects/{id}/abi:
 *   get:
 *     summary: Return the project abi
 *     description: Return the project abi corresponding to the specified project id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project database identifier
 *     tags:
 *       - Projects
 *     responses:
 *       '200':
 *         description: Project abi found
 *       '404':
 *         description: Project not found
*/
router.route('/:id/abi').get(handler(controller.getAbi));

/**
 * @swagger
 * /projects/{id}/tokens/{user}:
 *   get:
 *     summary: Return the project tokens owned by a user
 *     description: Return the project tokens corresponding to the specified project id and owned by the specified user.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project database identifier
 *       - in: path
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: User address
 *     tags:
 *       - Projects
 *     responses:
 *       '200':
 *         description: Project tokens found
 *       '404':
 *         description: Project not found
*/
router.route('/:id/tokens/:user').get(handler(controller.getTokensOf));

/**
 * @swagger
 * /projects/{id}/tokens:
 *   get:
 *     summary: Return the project tokens
 *     description: Return the project tokens corresponding to the specified project id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project database identifier
 *     tags:
 *       - Projects
 *     responses:
 *       '200':
 *         description: Project tokens found
 *       '404':
 *         description: Project not found
*/
router.route('/:id/tokens').get(handler(controller.getTokens));

/**
 * @swagger
 * /projects/{id}/tokens/user={user}&index={index}:
 *   get:
 *     summary: Return the project tokens by index of user
 *     description: Return the project tokens corresponding to the specified project id by index of user.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project database identifier
 *       - in: path
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: User address
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: Token index of user tokens
 *     tags:
 *       - Projects
 *     responses:
 *       '200':
 *         description: Project tokens found
 *       '404':
 *         description: Project not found
*/
router.route('/:id/token/user=:user&index=:index').get(handler(controller.getTokenByIndexOf));

/**
 * @swagger
 * /projects/{id}/tokens/{index}:
 *   get:
 *     summary: Return the project token by index
 *     description: Return the project token corresponding to the specified project id by index.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project database identifier
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: Token index of project tokens
 *     tags:
 *       - Projects
 *     responses:
 *       '200':
 *         description: Project tokens found
 *       '404':
 *         description: Project not found
*/
router.route('/:id/token/:index').get(handler(controller.getTokenByIndex));

/**
 * @swagger
 * /projects/{id}/balance/{user}:
 *   get:
 *     summary: Return the project balance of user
 *     description: Return the project token balance corresponding to the specified project id of user.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project database identifier
 *       - in: path
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: User address
 *     tags:
 *       - Projects
 *     responses:
 *       '200':
 *         description: Project tokens found
 *       '404':
 *         description: Project not found
*/
router.route('/:id/balance/:user').get(handler(controller.getBalanceOf));

/**
 * @swagger
 * /projects/{id}/owner/{token_id}:
 *   get:
 *     summary: Return the project token owner
 *     description: Return the project token owner corresponding to the specified project id of token.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project database identifier
 *       - in: path
 *         name: token_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Token blockchain identifier
 *     tags:
 *       - Projects
 *     responses:
 *       '200':
 *         description: Project token owner found
 *       '404':
 *         description: Project not found
*/
router.route('/:id/owner/:token_id').get(handler(controller.getOwnerOf));

/**
 * @swagger
 * /projects/{id}/uri/{token_id}:
 *   get:
 *     summary: Return the project token uri
 *     description: Return the project token uri corresponding to the specified project id of token.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project database identifier
 *       - in: path
 *         name: token_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Token blockchain identifier
 *     tags:
 *       - Projects
 *     responses:
 *       '200':
 *         description: Project token uri found
 *       '404':
 *         description: Project not found
*/
router.route('/:id/uri/:token_id').get(handler(controller.getTokenUri));

/**
 * @swagger
 * /projects/{id}/transfers:
 *   get:
 *     summary: Return the project token transfers
 *     description: Return the project token transfers corresponding to the specified project id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project database identifier
 *     tags:
 *       - Projects
 *     responses:
 *       '200':
 *         description: Project token transfers found
 *       '404':
 *         description: Project not found
*/
router.route('/:id/transfers').get(handler(controller.getTransfers));

/**
 * @swagger
 * /projects/{id}/minters:
 *   get:
 *     summary: Return the project minters
 *     description: Return the project minters corresponding to the specified project id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project database identifier
 *     tags:
 *       - Projects
 *     responses:
 *       '200':
 *         description: Project minters found
 *       '404':
 *         description: Project not found
*/
router.route('/:id/minters').get(handler(controller.getMinters));

/**
 * @swagger
 * /projects/{id}/offseters:
 *   get:
 *     summary: Return the project offseters
 *     description: Return the project offseters corresponding to the specified project id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project database identifier
 *     tags:
 *       - Projects
 *     responses:
 *       '200':
 *         description: Project offseters found
 *       '404':
 *         description: Project not found
*/
router.route('/:id/offseters').get(handler(controller.getOffseters));

/**
 * @swagger
 * /projects/{id}/yielders:
 *   get:
 *     summary: Return the project yielders
 *     description: Return the project yielders corresponding to the specified project id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project database identifier
 *     tags:
 *       - Projects
 *     responses:
 *       '200':
 *         description: Project yielders found
 *       '404':
 *         description: Project not found
*/
router.route('/:id/yielders').get(handler(controller.getYielders));

/**
 * @swagger
 * /projects/{address}:
 *   post:
 *     summary: Create a new project
 *     description: Create a project corresponding to the specified address.
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Project contract address
 *     tags:
 *       - Projects
 *     responses:
 *       '201':
 *         description: Project created
 *       '209':
 *         description: Project already recorded
 *       '500':
 *         description: Contract not found
*/
router.route('/:address').post(verify, handler(controller.add));

/**
 * @swagger
 * /projects/{address}:
 *   delete:
 *     summary: Delete a project
 *     description: Delete a project corresponding to the specified address.
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Project contract address
 *     tags:
 *       - Projects
 *     responses:
 *       '200':
 *         description: Project deleted
 *       '404':
 *         description: Project not found
 *       '500':
 *         description: Contract not found
*/
router.route('/:address').delete(verify, handler(controller.remove));

export default router;