import express from 'express';
import { createOrder, getOrders } from '../controllers/orderController.js';

const router = express.Router();

// Order processing
// POST /api/v1/orders/create
router.post('/create', createOrder);

// Query orders
// GET /api/v1/orders
router.get('/', getOrders);

export default router;
