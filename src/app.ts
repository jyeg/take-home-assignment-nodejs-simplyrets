import express from 'express';
import { propertyRoutes } from './routes';
import helmet from 'helmet';
import compression from 'compression';
import {
  errorLogger,
  errorResponder,
  invalidPathHandler,
} from './middlewares/errorHandler';

const app = express();
// Security middleware
app.use(helmet());

// compression
app.use(compression());
// Use routes
app.use('/properties', propertyRoutes);

// Attach the first Error handling Middleware
// function defined above (which logs the error)
app.use(errorLogger);

// Attach the second Error handling Middleware
// function defined above (which sends back the response)
app.use(errorResponder);

// Attach the fallback Middleware
// function which sends back the response for invalid paths)
app.use(invalidPathHandler);

export default app;
