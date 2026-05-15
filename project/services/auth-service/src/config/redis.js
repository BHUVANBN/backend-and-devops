import { createClient } from 'redis';

// Initialize Redis client using the REDIS_URL from .env
// In production, Redis is often a separate managed service (e.g., AWS ElastiCache) 
// or a persistent container within the Kubernetes cluster.
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Redis client error handling is mission-critical
// If Redis fails, we should log it but (usually) allow the app to fall back to the main DB.
redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Immediate connection attempt
// In Node-Redis v4+, we need to manually call connect()
const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('Redis Client Connected');
  }
};

export { redisClient, connectRedis };
