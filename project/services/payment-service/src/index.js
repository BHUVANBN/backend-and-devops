import 'dotenv/config';
import express from 'express';
import paymentRoutes from './routes/paymentRoutes.js';
import { consumeEvents } from './utils/consumer.js';

const app = express();
app.use(express.json());

// Start Kafka Consumer to listen to Order Created events
// This demonstrates the async, event-driven side of our architecture.
consumeEvents().catch(err => console.error('Failed to start consumer:', err));

// Health Check 
app.get('/health', (req, res) => res.status(200).json({ status: 'UP', service: 'payment-service' }));

// Payment Routes
app.use('/api/v1/payments', paymentRoutes);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Payment Service running on port ${PORT}`));
