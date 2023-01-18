import { Router } from 'express';
import controller from '../controllers/yielder.controller';
import handler from '../handlers/controller.handler';

const router = Router();

router.route('/').get(handler(controller.getAll));
router.route('/:id').get(handler(controller.getOne));
router.route('/:id/apr').get(handler(controller.getApr));

export default router;