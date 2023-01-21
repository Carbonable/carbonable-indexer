import { Router } from 'express';
import controller from '../controllers/main.controller';
import handler from '../handlers/controller.handler';

const router = Router();

router.route('/restart').post(handler(controller.restart));

export default router;