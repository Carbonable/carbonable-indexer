import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import router from './routers';
import controller from './controllers/main.controller';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () => {
    controller.init();
    controller.run();
    console.log(`\x1b[1;33m\u26a1Running server on : http://localhost:${PORT}/ \u26a1\x1b[0m`);
});

export default app;