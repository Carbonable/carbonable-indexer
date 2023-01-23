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
 *       - projects
*/
router.route('/').get(handler(controller.getAll));

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Return one project
 *     description: Return the project corresponding to the specified id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project database identifier
 *     tags:
 *       - projects
*/
router.route('/:id').get(handler(controller.getOne));
router.route('/:id/abi').get(handler(controller.getAbi));
router.route('/:id/tokens/:user').get(handler(controller.getTokensOf));
router.route('/:id/tokens').get(handler(controller.getTokens));
router.route('/:id/token/user=:user&index=:index').get(handler(controller.getTokenByIndexOf));
router.route('/:id/token/:index').get(handler(controller.getTokenByIndex));
router.route('/:id/balance/:user').get(handler(controller.getBalanceOf));
router.route('/:id/owner/:token_id').get(handler(controller.getOwnerOf));
router.route('/:id/uri/:token_id').get(handler(controller.getTokenUri));
router.route('/:id/transfers').get(handler(controller.getTransfers));

router.route('/:address').post(handler(controller.add));
router.route('/:address').delete(handler(controller.remove));

export default router;