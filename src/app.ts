import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV;

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

app.listen(port, () => {
  logger.info(`Server running on port ${port} with the ${env} configuration`);
});
