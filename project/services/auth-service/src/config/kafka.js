import { Kafka } from 'kafkajs';

// Initialize Kafka client
// In production, brokers should be an environment variable (e.g., KAFKA_BROKERS=kafka:9092)
const kafka = new Kafka({
  clientId: 'auth-service',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});

export default kafka;
