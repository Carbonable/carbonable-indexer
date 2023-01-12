
import { Router } from 'express';
import project from './project.router';

const router = Router();

router.use('/project', project);

// API 404
router.use((req, res) => {
    res.status(404).send('404');
});

export default router;