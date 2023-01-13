
import { Router } from 'express';
import project from './project.router';
import minter from './minter.router';
import payment from './payment.router';
import vester from './vester.router';
import offseter from './offseter.router';
import yielder from './yielder.router';

import { Request, Response } from 'express';

const router = Router();

router.use('/projects', project);
router.use('/minters', minter);
router.use('/payments', payment);
router.use('/vesters', vester);
router.use('/offseters', offseter);
router.use('/yielders', yielder);

// API 404
router.use((_request: Request, response: Response) => {
    response.status(404).send('404');
});

export default router;