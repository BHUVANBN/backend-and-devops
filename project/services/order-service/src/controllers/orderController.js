/**
 * Order Controller: Business logic for processing user purchases.
 * 
 * Flow: 
 * 1. Store Order in Local Database (PostgreSQL via Prisma)
 * 2. Publish ORDER_CREATED event via Kafka to allow for async processing 
 *    (e.g., Payment initiation, Inventory updates)
 */

import prisma from '../config/db.js';
import { publishOrderCreated } from '../utils/producer.js';

export const createOrder = async (req, res) => {
  try {
    const { userId, items, amount } = req.body;

    if (!userId || !amount) {
        return res.status(400).json({ status: 'fail', message: 'Missing userId or amount' });
    }

    // 1. Persist the Order to PostgreSQL
    const newOrder = await prisma.order.create({
      data: {
        userId,
        amount,
        status: 'PENDING' // Status will be updated via Payment Service later via Kafka
      }
    });

    // 2. Publish Kafka Event
    // We don't block the response. The 'Payment Service' will listen 
    // to this event and initiate the Stripe transaction.
    await publishOrderCreated(newOrder.id, newOrder.amount, newOrder.userId);

    res.status(201).json({
      status: 'success',
      data: { order: newOrder }
    });
  } catch (err) {
    console.error('💥 Error creating order:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getOrders = async (req, res) => {
    try {
        const { userId } = req.query;
        const orders = await prisma.order.findMany({
            where: { userId: userId || undefined }
        });
        res.status(200).json({ status: 'success', data: { orders } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
