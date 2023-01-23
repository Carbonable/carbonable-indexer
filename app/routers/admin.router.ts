import { Router } from 'express';
import controller from '../controllers/main.controller';
import handler from '../handlers/controller.handler';

const router = Router();
/**
 * @swagger
 * /admin/restart:
 *   post:
 *     summary: Restart the blockchain stream
 *     description: Update the config of the apibara indexer by setting the block cursor to the first block.
 *     tags:
 *       - admin
*/
router.route('/restart').post(handler(controller.restart));

export default router;