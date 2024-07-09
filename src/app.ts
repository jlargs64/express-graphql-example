import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import http from 'http';
import { resolvers } from './resolvers';
import { typeDefs } from './schema';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

// Server vars
const app: Express = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'dev';
const isProduction = process.env.NODE_ENV === 'production';

// graphql
interface MyContext {
  token?: String;
}

async function startApolloServer() {
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    introspection: !isProduction, // Enable introspection in non-production environments
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  // Init middlewares
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  // logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  // Error handling middleware
  app.use((err: Error, req: Request, res: Response, next: Function) => {
    logger.error(err);
    res.status(500).send('An unexpected error occurred');
  });

  // graphql middleware
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  logger.info(`${env} server ready at http://localhost:${port}/graphql`);
}

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API is running' });
});

app.get('/say-hi', (req: Request, res: Response) => {
  const name = req.query.name;
  let message = '';
  if (name == null || name?.length == 0) {
    message = "Hi! I don't know you!";
  } else {
    message = `Hi ${name}!`;
  }
  logger.debug(`I said: ${message}`);
  return res.json({ message: message });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

startApolloServer().catch((error) => {
  logger.error('Failed to start server', error);
});
