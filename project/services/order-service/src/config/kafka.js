import { Kafka } from 'kafkajs';

// Shared Kafka Client for Order Service
const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});

export default kafka;
