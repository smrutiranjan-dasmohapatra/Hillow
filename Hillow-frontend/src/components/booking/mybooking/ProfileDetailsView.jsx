import { ArrowLeft, X } from "lucide-react";

export default function ProfileDetailsView({ user, onBack, onClose }) {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-white text-black">
      <div className="flex items-center justify-between p-5 border-b border-black/10 bg-neutral-50 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-neutral-600 hover:text-black transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>BACK TO MENU</span>
        </button>
        <button onClick={onClose} className="p-1.5 text-neutral-600 hover:text-black transition cursor-pointer">
          <X size={16} />
        </button>
      </div>

      <div className="p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
        <h2 className="text-xl font-light text-black mb-4">Profile Information</h2>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 bg-neutral-50 rounded-none border-b border-black/10">
            <p className="text-neutral-500 text-[10px] uppercase">First Name</p>
            <p className="text-black font-medium mt-0.5">{user?.first_name || "-"}</p>
          </div>
          <div className="p-3 bg-neutral-50 rounded-none border-b border-black/10">
            <p className="text-neutral-500 text-[10px] uppercase">Last Name</p>
            <p className="text-black font-medium mt-0.5">{user?.last_name || "-"}</p>
          </div>
          <div className="p-3 bg-neutral-50 rounded-none border-b border-black/10">
            <p className="text-neutral-500 text-[10px] uppercase">Email Address</p>
            <p className="text-black font-medium mt-0.5 truncate">{user?.email || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}