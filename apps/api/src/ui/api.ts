import express, { Application, json } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { EnvironmentService } from '@infrastructure/services/environment-service';

import authenticationRouter from './routes/authentication-routes';
import healthRouter from './routes/health-routes';
import { errorHandlerMiddleware } from './middlewares/error-handler-middleware';

export const createApp = (): Application => {
  const { ENVIRONMENT, CORS_ORIGIN } = new EnvironmentService().get();
  const API_VERSION = '/api/v1';

  const app = express();
  const helmetConfig = {
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  };
  app.use(helmet(ENVIRONMENT === 'production' ? helmetConfig : { hsts: false }));
  app.use(
    cors({
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      origin: CORS_ORIGIN || '*',
    })
  );
  app.use(json());

  app.use(`${API_VERSION}/auth`, authenticationRouter);
  app.use(`${API_VERSION}/health`, healthRouter);

  app.use(errorHandlerMiddleware);

  return app;
};

export const startHttpApi = (app: Application): void => {
  const { API_PORT } = new EnvironmentService().get();
  app.listen(API_PORT, () => {
    console.log(`API is running on port ${API_PORT}`);
  });
};
