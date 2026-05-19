import { useState } from "react";
import { createOrder, verifyPayment } from "../../services/donationService";
import useAuthStore from "../../store/authStore";
import { ShieldCheck, Heart, User, Lock, CreditCard, CheckCircle } from "lucide-react";
import { cn } from "../../utils";

// Dynamically load Razorpay checkout script if not already present
const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK. Check your internet connection."));
    document.body.appendChild(script);
  });
};

function DonationForm({ campaignId, campaignTitle, goalAmount, currentAmount, onSuccess, onAmountChange }) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { user } = useAuthStore();
  const predefinedAmounts = [500, 1000, 2500, 5000];

  const handleAmountSelect = (val) => {
    setAmount(val.toString());
    if (onAmountChange) onAmountChange(val.toString());
  };

  const handleDonate = async () => {
    if (!amount || Number(amount) < 1) {
      setError("Please enter a valid amount (₹1 minimum)");
      return;
    }

    if (!user) {
      setError("Please login to make a donation");
      return;
    }

    if (Number(amount) > (goalAmount || 0)) {
      setError(`Amount cannot exceed the total goal of ₹${(goalAmount || 0).toLocaleString()}`);
      return;
    }

    const remainingAmount = (goalAmount || 0) - (currentAmount || 0);
    if (Number(amount) > remainingAmount && remainingAmount > 0) {
      setError(`Amount exceeds the remaining goal of ₹${remainingAmount.toLocaleString()}`);
      return;
    }

    setError("");

    try {
      setLoading(true);

      // Ensure Razorpay SDK is loaded before proceeding
      await loadRazorpayScript();

      // Step 1: Create Razorpay order via backend
      const orderData = await createOrder({
        campaignId,
        amount: Number(amount),
      });

      // The backend now returns an error if goal is reached, 
      // but we can add a frontend check here if we want to be proactive.
      // However, handleDonate is usually called when the form is visible.

      // Step 2: Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ImpactFund",
        description: `Donation to "${orderData.campaignTitle || campaignTitle}"`,
        order_id: orderData.orderId,
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: {
          color: "#059669",
        },
        handler: async function (response) {
          try {
            // Step 3: Verify payment on backend
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              campaignId,
              amount: Number(amount),
              message,
              anonymous,
            });

            setPaymentSuccess(true);
            setAmount("");
            setMessage("");
            setAnonymous(false);

            if (onSuccess) onSuccess();

            // Reset success state after 5 seconds
            setTimeout(() => setPaymentSuccess(false), 5000);
          } catch (err) {
            setError("Payment verification failed. Please contact support.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError("Payment cancelled. No amount was charged.");
            setTimeout(() => setError(""), 4000);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setLoading(false);
        setError(
          `Payment failed: ${response.error.description || "Unknown error"}`
        );
      });
      rzp.open();
    } catch (err) {
      setLoading(false);
      console.error("Donation error:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to initiate payment";
      setError(typeof msg === "string" ? msg : "Something went wrong. Please try again.");
    }
  };

  // Success state
  if (paymentSuccess) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-emerald-200 overflow-hidden">
        <div className="bg-emerald-500 text-white py-4 px-6 text-center font-bold text-lg flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" /> Payment Successful!
        </div>
        <div className="p-8 text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Thank You! 🎉</h3>
          <p className="text-gray-500">
            Your donation of <span className="font-bold text-emerald-600">₹{Number(amount || 0).toLocaleString()}</span> has been processed successfully.
          </p>
          <p className="text-sm text-gray-400">
            A confirmation email has been sent to your registered email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-emerald-500 text-white py-4 px-6 text-center font-bold text-lg flex items-center justify-center gap-2">
        <Heart className="w-5 h-5 fill-current" /> Make a Secure Donation
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Razorpay badge */}
        <div className="flex items-center justify-center gap-2 bg-blue-50 border border-blue-100 rounded-xl py-2.5 px-4">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-blue-700">Powered by Razorpay • UPI, Cards, NetBanking, Wallets</span>
        </div>

        {/* Predefined Amounts */}
        <div className="grid grid-cols-4 gap-3">
          {predefinedAmounts.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handleAmountSelect(val)}
              className={cn(
                "py-3 rounded-xl font-bold text-base border-2 transition-all",
                amount === val.toString()
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                  : "border-gray-200 text-gray-600 hover:border-emerald-200 hover:bg-gray-50"
              )}
            >
              ₹{val.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Amount Input */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span className="text-gray-500 font-bold text-xl">₹</span>
            </div>
            <input
              type="number"
              min="1"
              step="1"
              placeholder="Enter other amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (onAmountChange) onAmountChange(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-4 text-xl font-bold text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium bg-red-50 border border-red-100 rounded-lg px-4 py-3 flex items-center gap-2">
            <Lock className="w-4 h-4" /> {error}
          </p>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Words of Support (Optional)
          </label>
          <textarea
            placeholder="Write a message of encouragement"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={200}
            className="w-full h-24 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 resize-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Anonymous toggle */}
        <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={() => setAnonymous(!anonymous)}
            className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-500" /> Donate Anonymously
            </span>
            <span className="text-xs text-gray-500">Your name will be hidden from the public.</span>
          </div>
        </label>

        {/* Submit button */}
        <button
          onClick={handleDonate}
          disabled={loading || !amount}
          className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:hover:bg-emerald-600 text-white text-lg font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <path stroke="currentColor" strokeWidth="4" strokeLinecap="round" d="M12 3a9 9 0 0 1 9 9" />
              </svg>
              Opening Razorpay...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              {`Pay ₹${amount ? Number(amount).toLocaleString() : "0"}`}
            </>
          )}
        </button>

        <div className="pt-2 text-center text-xs text-gray-500 font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          100% Secure • Razorpay Encrypted Payment
        </div>
      </div>
    </div>
  );
}

export default DonationForm;