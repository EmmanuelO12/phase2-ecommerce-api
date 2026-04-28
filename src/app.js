import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import apiRoutes from './routes/index.js';
import { swaggerSpec } from './docs/swagger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
