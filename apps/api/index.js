import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { userRouter } from './routes/userRoute.js';
import flatRoutes from "./routes/flat.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---- MongoDB Atlas Connection ----
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// endpoint for User API
app.use('/users', userRouter);

// Endpoint for Flat
app.use("/flats", flatRoutes);

// Endpoint for Message 
app.use("/flats/:id/messages", messageRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));