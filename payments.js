const Razorpay = require('razorpay');
const crypto = require('crypto');

const instance = new Razorpay({
  key_id: process.env.RZP_KEY,
  key_secret: process.env.RZP_SECRET
});

// 1. Create an Order (Server-side only for security)
async function createDepositOrder(amount, userId) {
    const options = {
        amount: amount * 100, // Amount in paise
        currency: "INR",
        receipt: `receipt_${userId}_${Date.now()}`
    };
    return await instance.orders.create(options);
}

// 2. Webhook Verification (Prevents "fake" payment hacks)
function verifyWebhook(body, signature) {
    const expectedSignature = crypto
        .createHmac('sha256', process.env.WEBHOOK_SECRET)
        .update(JSON.stringify(body))
        .digest('hex');
    return expectedSignature === signature;
}