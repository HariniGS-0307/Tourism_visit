import Razorpay from "razorpay";

let _instance: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (_instance) return _instance;
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }
  _instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return _instance;
}
