import ActionButton from "../common/ActionButton"; // Adjust path if needed (e.g., "./ActionButton")

export default function BookingSummary({ booking, setStep }) {
  if (!booking) return null;

  return (
    <div className="flex h-full w-full flex-col justify-between space-y-4 pt-1 text-sm">
      {/* Summary Box Section */}
      <div className="space-y-2.5">
        <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          (3) Verify your reservation details
        </h3>

        <div className="rounded-2xl border border-gray-200 bg-gray-50/30 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs text-gray-500">Booking ID</span>
            <span className="text-xs font-semibold text-gray-900">
              {booking.booking_id}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs text-gray-500">Capsule</span>
            <span className="text-xs font-semibold text-gray-900">
              {booking.capsule_name}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs text-gray-500">Dates</span>
            <span className="text-xs font-semibold text-gray-900">
              {booking.check_in} — {booking.check_out}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs text-gray-500">Guests</span>
            <span className="text-xs font-semibold text-gray-900">
              {booking.guests}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs text-gray-500">Total</span>
            <span className="text-xs font-bold text-black">
              ₹ {booking.total_amount}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-500">Status</span>
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-700">
              {booking.status}
            </span>
          </div>
        </div>
      </div>

      {/* Reusable Action Button */}
      <div className="pt-2 border-t border-gray-100 bg-white">
        <ActionButton
          label="Continue to Payment"
          onClick={() => setStep(3)}
        />
      </div>
    </div>
  );
}