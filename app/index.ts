import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

import router from './routers';
import controller from './controllers/main.controller';

const PORT = process.env.PORT || 8080;
const app = express();

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Carbonable Indexer API',
        version: '0.0.1',
    },
};

const swaggerSpec = swaggerJSDoc({ swaggerDefinition, apis: ['./app/routers/*.ts'] });

app.use(cors());
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCss: '.swagger-ui .topbar { display: none }' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);



app.listen(PORT, async () => {
    await controller.init();
    controller.run();
    console.log(`\x1b[1;33m\u26a1Running server on : http://localhost:${PORT}/ \u26a1\x1b[0m`);
});

export default app;