import { Kafka } from 'kafkajs';

// Shared Kafka Client for Payment Service
const kafka = new Kafka({
  clientId: 'payment-service',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});

export default kafka;
