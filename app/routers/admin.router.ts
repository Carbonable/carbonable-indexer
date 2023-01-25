import { Router } from 'express';
import mainController from '../controllers/main.controller';
import controller from '../controllers/admin.controller';
import handler from '../handlers/controller.handler';

const router = Router();
/**
 * @swagger
 * /admin/restart:
 *   post:
 *     summary: Restart the blockchain stream
 *     description: Update the config of the apibara indexer by setting the block cursor to the first block.
 *     tags:
 *       - Admin
 *     responses:
 *       '200':
 *         description: Stream restarted
*/
router.route('/restart').post(handler(mainController.restart));

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
 *     tags:
 *       - Admin
 *     responses:
 *       '200':
 *         description: Creations run successfully
*/
router.route('/create/badge=:badge&project=:project&minter=:minter&vester=:vester&offseter=:offseter&yielder=:yielder').post(handler(controller.create));

export default router;