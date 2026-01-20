import express from 'express';
import cors from 'cors';
import { userRouter } from './routes/userRoute.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---- MongoDB Atlas Connection ----
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// JWT Authentication Middleware


// endpoint for User API
app.use('/users', userRouter);

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});