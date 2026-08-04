import { ArrowLeft, RefreshCw, X, Minimize2, Maximize2, Loader2, Trash2, Sparkles } from "lucide-react";
import BookingCard from "./BookingCard";

export default function BookingsView({
  bookings,
  loading,
  error,
  isExpanded,
  isDeletingAll,
  deletingId,
  copiedId,
  onBack,
  onClose,
  onRefresh,
  onToggleExpand,
  onDeleteAllRequest,
  onDeleteSingleRequest,
  onCopyId,
}) {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-white text-black">
      {/* View Header */}
      <div className="flex items-center justify-between p-4 border-b border-black/10 bg-neutral-50 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono text-neutral-600 hover:text-black transition cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>BACK TO MENU</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-none text-neutral-600 hover:text-black hover:bg-neutral-200 transition cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-black" : ""} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none text-neutral-600 hover:text-black hover:bg-neutral-200 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Action Header */}
      <div className="px-5 pt-4 pb-2 shrink-0 flex items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
            Reservations
          </span>
          <h2 className="text-lg font-light text-black">Your Bookings</h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-1 px-2 py-1 border border-black text-[10px] font-mono uppercase tracking-wider text-black bg-white hover:bg-black hover:text-white transition cursor-pointer"
            title={isExpanded ? "Collapse View" : "View All (Full Screen)"}
          >
            {isExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            <span>{isExpanded ? "Collapse" : "View All"}</span>
          </button>

          {bookings.length > 0 && (
            <button
              onClick={onDeleteAllRequest}
              disabled={isDeletingAll || loading}
              className="flex items-center gap-1 px-2 py-1 border border-red-600 text-[10px] font-mono uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
              title="Delete All Bookings"
            >
              {isDeletingAll ? (
                <Loader2 size={12} className="animate-spin text-white" />
              ) : (
                <Trash2 size={12} />
              )}
              <span>Delete All</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3 min-h-0">
        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-none border border-black/10 bg-neutral-900 p-3 space-y-2 animate-pulse">
                <div className="h-3 w-3/4 bg-neutral-800 rounded-none" />
                <div className="h-2.5 w-1/2 bg-neutral-800 rounded-none" />
                <div className="h-2.5 w-2/3 bg-neutral-800 rounded-none" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-3 rounded-none border-b border-red-300 bg-red-50 text-center text-xs text-red-600">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-12 text-center text-neutral-400 space-y-1.5 flex flex-col items-center">
            <Sparkles size={20} className="text-black/40 mb-1" />
            <p className="text-xs font-medium text-black">No Bookings Found</p>
            <p className="text-[11px] text-neutral-500 max-w-[200px]">
              You don't have any active capsule reservations yet.
            </p>
          </div>
        ) : (
          <div className={`grid gap-3 ${isExpanded ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {bookings.map((item, idx) => {
              const bookingId = item.id || item.booking_id || item._id || `HLW-${idx + 101}`;
              return (
                <BookingCard
                  key={bookingId}
                  item={item}
                  index={idx}
                  isDeleting={deletingId === bookingId}
                  copiedId={copiedId}
                  onCopyId={onCopyId}
                  onDeleteRequest={onDeleteSingleRequest}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}