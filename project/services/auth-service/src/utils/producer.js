import kafka from '../config/kafka.js';

const producer = kafka.producer();

// This utility sends events to Kafka topics
// Event-driven communication allows us to decouple services
// For example, when a user is created, we emit a message that the 'notification-service' 
// or 'profile-service' can listen to without the Auth Service knowing about them.
export const publishEvent = async (topic, event) => {
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: [
        { value: JSON.stringify(event) },
      ],
    });
    console.log(`Event published to topic ${topic}:`, event);
  } catch (err) {
    console.error(`Error publishing event to ${topic}:`, err);
  } finally {
    // In a high-throughput production environment, we might keep the producer connection open
    // However, for this implementation, we ensure it's disconnected or handled via lifecycle hooks.
    await producer.disconnect();
  }
};
