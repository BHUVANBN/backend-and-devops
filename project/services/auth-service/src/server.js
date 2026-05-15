import express from 'express';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Middleware to parse JSON bodies
// Production-ready microservices must always explicitly handle request body limits
app.use(express.json({ limit: '10kb' }));

// Health check endpoint
// Critical for Kubernetes to know if the service is alive (Liveness Probe)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'auth-service' });
});

// Mount auth routes
app.use('/api/v1/auth', authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('ERROR 💥', err);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

export default app;
