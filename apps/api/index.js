import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { SECRET_KEY, PORT } from './server.js';
import { userRouter } from './routes/userRoute.js';

const app = express();
app.use(cors());
app.use(express.json());

// ---- MongoDB Atlas Connection ----
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// JWT Authentication Middleware


// endpoint for User API
app.use('/users', userRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});