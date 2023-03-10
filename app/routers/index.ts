
import { Router } from 'express';
import admin from './admin.router';
import docs from './docs.router';
import badge from './badge.router';
import project from './project.router';
import minter from './minter.router';
import payment from './payment.router';
import vester from './vester.router';
import offseter from './offseter.router';
import yielder from './yielder.router';
import vesting from './vesting.router';
import snapshot from './snapshot.router';
import portfolio from './portfolio.router';

import { Request, Response } from 'express';

const router = Router();

router.use('/admin', admin);
router.use('/docs', docs);
router.use('/badges', badge);
router.use('/projects', project);
router.use('/minters', minter);
router.use('/payments', payment);
router.use('/vesters', vester);
router.use('/offseters', offseter);
router.use('/yielders', yielder);
router.use('/vestings', vesting);
router.use('/snapshots', snapshot);
router.use('/portfolio', portfolio);

// API 404
router.use((_request: Request, response: Response) => {
    response.status(404).send('404');
});

export default router;