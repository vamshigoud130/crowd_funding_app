import axios from "../store/axios";

// Create Razorpay order
export const createOrder = async ({ campaignId, amount }) => {
  const res = await axios.post("/donations/create-order", { campaignId, amount });
  return res.data;
};

// Verify payment after Razorpay checkout
export const verifyPayment = async (paymentData) => {
  const res = await axios.post("/donations/verify-payment", paymentData);
  return res.data;
};

// Get Razorpay key
export const getRazorpayKey = async () => {
  const res = await axios.get("/donations/razorpay-key");
  return res.data.keyId;
};

// Legacy donate (fallback)
export const donate = async ({ campaignId, amount, message, anonymous }) => {
  try {
    const res = await axios.post(`/donations`, {
      campaignId,
      amount,
      message,
      anonymous,
      paymentId: `pay_demo_${Date.now()}`,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Donation failed";
  }
};
