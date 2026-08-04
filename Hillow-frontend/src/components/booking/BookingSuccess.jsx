import ActionButton from "../common/ActionButton"; // Adjust path as needed (e.g., "./ActionButton")

export default function BookingSuccess({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div className="flex h-full w-full flex-col justify-between space-y-4 pt-1 text-sm">
      {/* Confirmation & Summary Section */}
      <div className="space-y-3">
        {/* Subtle Success Badge Header */}
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200/60 p-3 text-emerald-800">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
            ✓
          </div>
          <span className="text-xs font-semibold">
            Reservation Confirmed & Paid
          </span>
        </div>

        {/* Details Card */}
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

          {booking.check_in && booking.check_out && (
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs text-gray-500">Dates</span>
              <span className="text-xs font-semibold text-gray-900">
                {booking.check_in} — {booking.check_out}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs text-gray-500">Total Paid</span>
            <span className="text-xs font-bold text-black">
              ₹ {booking.total_amount}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-500">Status</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              {booking.status}
            </span>
          </div>
        </div>
      </div>

      {/* Reusable Action Button */}
      <div className="pt-2 border-t border-gray-100 bg-white">
        <ActionButton
          label="Done & Close"
          onClick={onClose}
        />
      </div>
    </div>
  );
}