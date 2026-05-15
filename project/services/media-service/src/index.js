import 'dotenv/config';
import express from 'express';
import mediaRoutes from './routes/mediaRoutes.js';

const app = express();
app.use(express.json());

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'UP', service: 'media-service' }));

// Media Routes
app.use('/api/v1/media', mediaRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Media Service running on port ${PORT}`));
