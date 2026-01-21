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
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// endpoint for User API
app.use('/users', userRouter);

// Endpoint for Flat
app.use("/flats", flatRoutes);

// Endpoint for Message 
app.use("/flats/:id/messages", messageRoutes);

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});