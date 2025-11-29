import express, { Application } from 'express';
import resourceRoutes from './routes/resourceRoutes';
import errorHandler from './utils/errorHandler';

const app: Application = express();

app.use(express.json());

app.use('/api/resources', resourceRoutes);

app.use(errorHandler);

export default app;