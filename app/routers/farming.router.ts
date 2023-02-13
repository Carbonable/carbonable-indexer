import { Router } from 'express';
import controller from '../controllers/farming.controller';
import handler from '../handlers/controller.handler';

const router = Router();

/**
 * @swagger
 * /farming/list/:customerId:
 *   get:
 *     summary: Return customer farming list assets
 *     description: Return customer farming list assets
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: User address
 *     tags:
 *       - Farming
 *     responses:
 *       '200':
 *         description: Customer farming list assets computed
*/
router.route('/list/:customerId').get(handler(controller.customerProjects));

/**
 * @swagger
 * /farming/list/unconnected/:projectSlug:
 *   get:
 *     summary: Return customer farming list assets
 *     description: Return customer farming list assets
 *     parameters:
 *       - in: path
 *         name: projectSlug
 *         schema:
 *           type: string
 *         required: true
 *         description: Project slug
 *     tags:
 *       - Farming
 *     responses:
 *       '200':
 *         description: Customer farming project informations
*/
router.route('/list/unconnected/:projectSlug').get(handler(controller.projectListUnconnectedData));

/**
 * @swagger
 * /farming/list/global/:customerId:
 *   get:
 *     summary: Return customer farming list assets
 *     description: Return customer farming list assets
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: User address
 *     tags:
 *       - Farming
 *     responses:
 *       '200':
 *         description: Customer farming list assets computed
*/
router.route('/list/global/:customerId').get(handler(controller.customerListGlobal));

/**
 * @swagger
 * /farming/:customerId/:projectSlug:
 *   get:
 *     summary: Return customer farming list assets
 *     description: Return customer farming list assets
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: User address
 *     tags:
 *       - Farming
 *     responses:
 *       '200':
 *         description: Customer farming project informations
*/
router.route('/list/:customerId/:projectSlug').get(handler(controller.projectInformations));
/**
 * @swagger
 * /details/:customerId/:projectSlug/details:
 *   get:
 *     summary: Return customer farming list assets
 *     description: Return customer farming list assets
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: User address
 *       - in: path
 *         name: projectSlug
 *         schema:
 *           type: string
 *         required: true
 *         description: Project address
 *     tags:
 *       - Farming
 *     responses:
 *       '200':
 *         description: Customer farming project details
*/
router.route('/details/:customerId/:projectSlug').get(handler(controller.projectDetails));

/**
 * @swagger
 * /farming/list:
 *   get:
 *     summary: Return all farming list projects
 *     description: Return all farming project list
 *     tags:
 *       - Farming
 *     responses:
 *       '200':
 *         description: All farming list project computed
*/
router.route('/list').get(handler(controller.list));


export default router;

