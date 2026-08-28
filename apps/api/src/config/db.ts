import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase(uri: string = env.MONGO_URL): Promise<void> {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
