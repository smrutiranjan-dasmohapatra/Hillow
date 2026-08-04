import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({ confirmState, onClose, onConfirm }) {
  if (!confirmState.show) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-none bg-white border border-black/20 p-6 text-center shadow-2xl space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-none bg-red-100 text-red-600 border border-red-200">
          <AlertTriangle size={22} />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold text-black">
            {confirmState.type === "all" ? "Delete All Reservations?" : "Cancel Reservation?"}
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            {confirmState.type === "all"
              ? "Are you sure you want to delete ALL of your active reservations? This action cannot be undone."
              : "Are you sure you want to cancel and delete this reservation? This action cannot be undone."}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-none border border-black/20 bg-neutral-100 py-2.5 text-xs font-medium text-black hover:bg-neutral-200 transition cursor-pointer"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-none bg-red-600 py-2.5 text-xs font-medium text-white hover:bg-red-700 transition shadow-md cursor-pointer"
          >
            {confirmState.type === "all" ? "Yes, Delete All" : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}