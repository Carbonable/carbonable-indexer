import { Router } from 'express';
import controller from '../controllers/offseter.controller';
import handler from '../handlers/controller.handler';

const router = Router();

router.route('/').get(handler(controller.getAll));
router.route('/:id').get(handler(controller.getOne));
router.route('/:id/abi').get(handler(controller.getAbi));

router.route('/:address').post(handler(controller.add));
router.route('/:address').delete(handler(controller.remove));

export default router;