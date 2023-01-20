import { Router } from 'express';
import controller from '../controllers/vester.controller';
import handler from '../handlers/controller.handler';

const router = Router();

router.route('/').get(handler(controller.getAll));
router.route('/:id').get(handler(controller.getOne));
router.route('/:id/abi').get(handler(controller.getAbi));

export default router;