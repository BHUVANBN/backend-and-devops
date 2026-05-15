import Razorpay from 'razorpay';
import 'dotenv/config';

/**
 * Razorpay Configuration
 * 
 * Razorpay is an Indian payment gateway.
 * In production, ensure the keys are stored securely.
 */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export default razorpay;
