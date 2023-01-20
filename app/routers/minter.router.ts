import { Router } from 'express';
import controller from '../controllers/minter.controller';
import handler from '../handlers/controller.handler';

const router = Router();

router.route('/').get(handler(controller.getAll));
router.route('/:id').get(handler(controller.getOne));
router.route('/:id/abi').get(handler(controller.getAbi));
router.route('/:id/whitelist/whitelist_id=:whitelist_id').get(handler(controller.getWhitelistedSlots));
router.route('/:id/claimed/user=:user').get(handler(controller.getClaimedSlots));

router.route('/:address').post(handler(controller.add));
router.route('/:address').delete(handler(controller.remove));

export default router;