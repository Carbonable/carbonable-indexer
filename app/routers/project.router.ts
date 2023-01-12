import { Router } from 'express';
import controller from '../controllers/project.controller';
import handler from '../handlers/controller.handler';

const router = Router();

router.route('/').get(handler(controller.getAll));
router.route('/:id').get(handler(controller.getOne));
router.route('/:id/balance/:user').get(handler(controller.getBalanceOf));
router.route('/:id/owner/:token_id').get(handler(controller.getOwnerOf));
router.route('/:id/uri/:token_id').get(handler(controller.getTokenUri));

export default router;