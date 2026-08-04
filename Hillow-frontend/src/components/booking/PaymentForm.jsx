import { useState, useEffect } from "react";
import { fakePayment } from "../../services/paymentService";
import { useAuth } from "../../context/AuthContext";
import ActionButton from "../common/ActionButton"; // Adjust path as needed (e.g., "./ActionButton")

export default function PaymentForm({ booking, setBooking, setStep }) {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("Initiating transaction...");
  const [paymentMethod, setPaymentMethod] = useState("upi_qr"); // 'upi_qr' | 'gpay' | 'card'
  const [error, setError] = useState("");

  const formattedAmount = (Number(booking?.total_amount) || 0).toLocaleString("en-IN");

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    // Simulated progress steps during the 4-second delay
    const steps = [
      "Connecting to payment gateway...",
      "Verifying credentials with bank...",
      "Securing payment transaction...",
      "Finalizing your reservation...",
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 1;
      if (currentStep < steps.length) {
        setLoadingStep(steps[currentStep]);
      }
    }, 1000);

    // Enforce minimum 3.8s animation before executing API call
    setTimeout(async () => {
      clearInterval(interval);
      try {
        const response = await fakePayment(booking.booking_id, token);
        if (setBooking) setBooking(response.booking || booking);
        if (setStep) setStep(4);
      } catch (err) {
        console.error("========== PAYMENT ERROR ==========", err);
        if (err.response) {
          setError(err.response.data.message || JSON.stringify(err.response.data));
        } else {
          setError(err.message || "Payment failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }, 3800);
  };

  return (
    <div className="relative flex h-full w-full flex-col justify-between space-y-4 pt-1 text-sm">
      {/* Dynamic Processing Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl bg-white/95 backdrop-blur-md p-6 space-y-6 animate-fade-in">
          <div className="relative flex items-center justify-center">
            {/* Outer Pulsing Ring */}
            <div className="h-20 w-20 rounded-full border-4 border-emerald-100 animate-ping absolute" />
            {/* Spinning Indicator */}
            <div className="h-16 w-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
            <span className="absolute text-xl">🔒</span>
          </div>

          <div className="text-center space-y-1">
            <h4 className="text-sm font-bold text-gray-900 tracking-tight">Processing Payment</h4>
            <p className="text-xs text-emerald-600 font-medium animate-pulse">{loadingStep}</p>
          </div>

          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden max-w-[200px]">
            <div className="bg-emerald-500 h-full w-full animate-pulse" />
          </div>

          <p className="text-[10px] text-gray-400">Please do not refresh or close this window.</p>
        </div>
      )}

      {/* Main Content Body */}
      <div className="space-y-3 overflow-y-auto pr-0.5 custom-scrollbar">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          (3) Select Payment Method & Pay
        </h3>

        {/* Summary Card */}
        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Booking Ref</span>
            <span className="font-mono font-semibold text-gray-900">
              #{booking?.booking_id || "CAP-8921"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Capsule</span>
            <span className="font-semibold text-gray-900">{booking?.capsule_name || "Classic C®"}</span>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-xs">
            <span className="font-semibold text-gray-700">Total Payable</span>
            <span className="text-sm font-black text-black">₹ {formattedAmount}</span>
          </div>
        </div>

        {/* Payment Method Tabs */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setPaymentMethod("upi_qr")}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
              paymentMethod === "upi_qr"
                ? "border-black bg-black text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="text-base">📱</span>
            <span className="text-[10px] font-bold mt-1">UPI / QR</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("gpay")}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
              paymentMethod === "gpay"
                ? "border-black bg-black text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="text-base">⚡</span>
            <span className="text-[10px] font-bold mt-1">GPay / PhonePe</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
              paymentMethod === "card"
                ? "border-black bg-black text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="text-base">💳</span>
            <span className="text-[10px] font-bold mt-1">Card / Net</span>
          </button>
        </div>

        {/* Tab Content 1: QR Scanner */}
        {paymentMethod === "upi_qr" && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-4 space-y-3">
            <div className="relative flex items-center justify-center p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Dummy QR Code UI */}
              <div className="h-28 w-28 bg-neutral-900 rounded flex flex-col justify-between p-2 text-[6px] text-white font-mono">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-2 border-white bg-black flex items-center justify-center">
                    <div className="w-2 h-2 bg-white" />
                  </div>
                  <div className="w-6 h-6 border-2 border-white bg-black flex items-center justify-center">
                    <div className="w-2 h-2 bg-white" />
                  </div>
                </div>
                <div className="text-center tracking-widest opacity-80">UPI SCAN</div>
                <div className="flex justify-between items-end">
                  <div className="w-6 h-6 border-2 border-white bg-black flex items-center justify-center">
                    <div className="w-2 h-2 bg-white" />
                  </div>
                  <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
            <p className="text-[10px] font-medium text-gray-500 text-center">
              Scan with any UPI App (BHIM, Paytm, PhonePe, GPay)
            </p>
          </div>
        )}

        {/* Tab Content 2: UPI Apps */}
        {paymentMethod === "gpay" && (
          <div className="space-y-2 rounded-xl border border-gray-200 bg-gray-50/50 p-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
              Enter UPI ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="username@upi / mobile@paytm"
                defaultValue="guest@okaxis"
                className="w-full rounded-lg border border-gray-300 p-2 text-xs text-gray-900 outline-none focus:border-black"
              />
            </div>
            <p className="text-[10px] text-gray-400">A payment request will be sent to your app.</p>
          </div>
        )}

        {/* Tab Content 3: Card Options */}
        {paymentMethod === "card" && (
          <div className="space-y-2 rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-xs">
            <input
              type="text"
              placeholder="Card Number (4532 •••• •••• 8922)"
              defaultValue="4532 8921 0023 8922"
              className="w-full rounded-lg border border-gray-300 p-2 outline-none focus:border-black"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="MM/YY"
                defaultValue="12/28"
                className="rounded-lg border border-gray-300 p-2 outline-none focus:border-black"
              />
              <input
                type="password"
                placeholder="CVV"
                defaultValue="882"
                maxLength="3"
                className="rounded-lg border border-gray-300 p-2 outline-none focus:border-black"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-2.5 text-center text-xs font-medium text-red-600 border border-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Reusable Action Button */}
      <div className="pt-2 border-t border-gray-100 bg-white">
        <ActionButton
          type="button"
          label={loading ? "Processing..." : `Pay ₹${formattedAmount}`}
          onClick={handlePayment}
          disabled={loading}
          loading={loading}
        />
      </div>
    </div>
  );
}