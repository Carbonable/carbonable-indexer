import { Router } from 'express';
import controller from '../controllers/project.controller';
import handler from '../handlers/controller.handler';

const router = Router();

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Return projects
 *     description: Return all projects found in the the database without filter.
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
 *     summary: Return project
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
 *     summary: Return project abi
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
 *     summary: Return project tokens owned by a user
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
 *     summary: Return project tokens
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
 *     summary: Return project tokens
 *     description: Return the project tokens corresponding to the specified project id.
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
router.route('/:id/token/:index').get(handler(controller.getTokenByIndex));
router.route('/:id/balance/:user').get(handler(controller.getBalanceOf));
router.route('/:id/owner/:token_id').get(handler(controller.getOwnerOf));
router.route('/:id/uri/:token_id').get(handler(controller.getTokenUri));
router.route('/:id/transfers').get(handler(controller.getTransfers));

router.route('/:address').post(handler(controller.add));
router.route('/:address').delete(handler(controller.remove));

export default router;