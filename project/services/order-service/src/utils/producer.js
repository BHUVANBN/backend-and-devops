import kafka from '../config/kafka.js';
const producer = kafka.producer();

// Publish ORDER_CREATED event to allow Payment and Shipping services to react
export const publishOrderCreated = async (orderId, totalAmount, userId) => {
  try {
    await producer.connect();
    await producer.send({
      topic: 'ORDER_CREATED',
      messages: [
        { 
            value: JSON.stringify({ 
                orderId, 
                totalAmount, 
                userId, 
                timestamp: new Date() 
            }) 
        }
      ],
    });
    console.log(`✅ Order Event Published: ${orderId}`);
  } catch (err) {
    console.error('❌ Failed to publish Order Event', err);
  } finally {
    await producer.disconnect();
  }
};
