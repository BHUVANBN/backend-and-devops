import express from 'express';
import { createPaymentIntent } from '../controllers/paymentController.js';

const router = express.Router();

// Payment Route
// /api/v1/payments/create-order
router.post('/create-order', createPaymentIntent);

export default router;
