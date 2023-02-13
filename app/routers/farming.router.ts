import { Router } from 'express';
import controller from '../controllers/farming.controller';
import handler from '../handlers/controller.handler';

const router = Router();

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
 * /farming/list/:customerId/:projectId:
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
router.route('/list/:customerId/:projectId').get(handler(controller.projectInformations));
/**
 * @swagger
 * /farming/list/:customerId/:projectId/details:
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
 *         name: projectId
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
router.route('/list/:customerId/:projectId/details').get(handler(controller.projectDetails));

export default router;

