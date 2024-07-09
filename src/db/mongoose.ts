import mongoose from 'mongoose';
import logger from '../utils/logger';

export const connectToMongoDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    logger.warn(
      'MONGODB_URI is not defined in the environment variables. MongoDB connection will not be established.',
    );
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
