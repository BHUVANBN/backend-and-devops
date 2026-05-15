import razorpay from '../config/razorpay.js';

/**
 * Create Razorpay Order
 * 
 * This initiates the payment flow. Returns an 'order' object to the frontend 
 * which will be used to open the Razorpay Checkout UI.
 */
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'receipt_order_01' } = req.body;

    if (!amount) {
      return res.status(400).json({ status: 'fail', message: 'No amount provided' });
    }

    // Razorpay uses the smallest currency unit (e.g., paise for INR)
    const options = {
      amount: amount * 100,
      currency: currency,
      receipt: receipt,
      payment_capture: 1 // Auto capture after successful payment
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      status: 'success',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency
      }
    });
  } catch (err) {
    console.error('Razorpay Error:', err);
    res.status(500).json({ status: 'error', message: 'Razorpay order creation failed' });
  }
};
