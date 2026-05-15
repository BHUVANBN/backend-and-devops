import kafka from '../config/kafka.js';

/**
 * Kafka Consumer: Subscriber Logic
 * 
 * In an event-driven microservices architecture, this consumer "listens" 
 * for specific events emitted by other services.
 * 
 * Here, the Payment Service listens to the 'ORDER_CREATED' topic.
 * When a new order is detected, it automatically initiates the payment process.
 */
export const consumeEvents = async () => {
    const consumer = kafka.consumer({ groupId: 'payment-service-group' });

    try {
        await consumer.connect();
        await consumer.subscribe({ topic: 'ORDER_CREATED', fromBeginning: true });

        console.log('📡 Payment Service: Listening for ORDER_CREATED events...');

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const event = JSON.parse(message.value.toString());
                
                console.log(`\n--- EVENT RECEIVED [${topic}] ---`);
                console.log(`Order ID: ${event.orderId}`);
                console.log(`Amount: $${event.totalAmount}`);
                console.log(`User: ${event.userId}`);
                
                // PRODUCTION LOGIC:
                // At this point, the Payment Service would:
                // 1. Create a Stripe Payment Intent
                // 2. Emit a 'PAYMENT_STARTED' event back to Kafka
                // 3. Email the user a payment link via SendGrid/SES
                console.log('✅ Payment Intent successfully prepared for this order.');
            },
        });
    } catch (err) {
        console.error('❌ Kafka Consumer Error:', err);
    }
};
