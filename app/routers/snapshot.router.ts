import { Router } from 'express';
import controller from '../controllers/snapshot.controller';
import handler from '../handlers/controller.handler';

const router = Router();

router.route('/').get(handler(controller.getAll));
router.route('/:id').get(handler(controller.getOne));

export default router;