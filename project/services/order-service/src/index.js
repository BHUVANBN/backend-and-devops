import 'dotenv/config';
import express from 'express';
import orderRoutes from './routes/orderRoutes.js';

const app = express();
app.use(express.json());

// Health check endpoint for K8s Liveness & Readiness Probes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'order-service' });
});

// Mount order domain routes
app.use('/api/v1/orders', orderRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`💼 Order Service running on port ${PORT}`);
});
