import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import gameRoutes from './routes/gameRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    query: req.query
  });
  next();
});

// Routes
app.use('/api', gameRoutes);

// Home route
app.get('/', (_req, res) => {
  res.send('Six Degrees of Movie Separation API');
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 