import { Router } from 'express';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
    apiVersion: "1.0.0",
    info: {
        title: 'Carbonable Indexer API',
        version: '0.0.1',
    },
};

const swaggerSpec = swaggerJSDoc({ swaggerDefinition, apis: ['./app/routers/*.ts'] });

const router = Router();
router.use(swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCss: '.swagger-ui .topbar { display: none }' }));

export default router;