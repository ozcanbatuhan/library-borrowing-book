import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/user.routes';
import bookRoutes from './routes/book.routes';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

// Error handling
app.use(errorHandler as express.ErrorRequestHandler);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 