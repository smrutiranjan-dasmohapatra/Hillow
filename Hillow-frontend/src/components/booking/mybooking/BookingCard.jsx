import { Calendar, User, CreditCard, Copy, Check, Trash2, Loader2 } from "lucide-react";

export default function BookingCard({
  item,
  index,
  isDeleting,
  copiedId,
  onCopyId,
  onDeleteRequest,
}) {
  const bookingId = item.id || item.booking_id || item._id || `HLW-${index + 101}`;

  return (
    <div className="rounded-none border border-neutral-800 bg-black text-white p-2.5 sm:p-3 md:p-3.5 space-y-1.5 sm:space-y-2 shadow-sm shrink-0 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 sm:pb-2">
        <div className="min-w-0 pr-2">
          <h4 className="font-medium text-[10px] sm:text-[11px] md:text-xs text-white leading-tight truncate">
            {item.capsule_name || item.capsule?.name || "Capsule Stay"}
          </h4>
          <p className="text-[8px] sm:text-[9px] font-mono text-neutral-400 uppercase">
            Hillow Sanctuary
          </p>
        </div>
        <span className="text-[7px] sm:text-[8px] font-mono px-1.5 py-0.5 rounded-none bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase font-semibold shrink-0">
          {item.status || "CONFIRMED"}
        </span>
      </div>

      {/* Details Section */}
      <div className="space-y-1 sm:space-y-1.5 text-xs text-neutral-300">
        <div className="flex items-center gap-1.5 bg-neutral-900 px-2 py-1 rounded-none border border-neutral-800 font-mono text-[9px] sm:text-[10px]">
          <Calendar size={10} className="text-amber-400 shrink-0 sm:w-[11px] sm:h-[11px]" />
          <span className="truncate">
            {item.check_in || item.checkIn} → {item.check_out || item.checkOut}
          </span>
        </div>

        <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono pt-0.5">
          <div className="flex items-center gap-1 text-neutral-400">
            <User size={10} className="text-amber-400 sm:w-[11px] sm:h-[11px]" />
            <span>{item.guests || 1} Guest(s)</span>
          </div>
          <div className="flex items-center gap-1 text-white font-medium">
            <CreditCard size={10} className="text-amber-400 sm:w-[11px] sm:h-[11px]" />
            <span>₹{(Number(item.total_amount || item.totalPrice) || 0).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-1.5 border-t border-neutral-800 flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-neutral-400">
        <button
          onClick={() => onCopyId(String(bookingId))}
          className="flex items-center gap-1 hover:text-white transition cursor-pointer truncate pr-2"
        >
          <span className="truncate">REF: {bookingId}</span>
          {copiedId === String(bookingId) ? (
            <Check size={8} className="text-emerald-400 shrink-0 sm:w-[9px] sm:h-[9px]" />
          ) : (
            <Copy size={8} className="shrink-0 sm:w-[9px] sm:h-[9px]" />
          )}
        </button>

        <button
          onClick={() => onDeleteRequest(bookingId)}
          disabled={isDeleting}
          className="flex items-center gap-1 text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950 px-1.5 py-0.5 rounded-none border border-red-900/50 transition cursor-pointer disabled:opacity-50 shrink-0"
          title="Cancel Booking"
        >
          {isDeleting ? (
            <Loader2 size={9} className="animate-spin text-red-400 sm:w-[10px] sm:h-[10px]" />
          ) : (
            <>
              <Trash2 size={9} className="sm:w-[10px] sm:h-[10px]" />
              <span>Cancel</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}