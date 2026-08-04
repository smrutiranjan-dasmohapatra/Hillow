import { ArrowUpRight } from "lucide-react";

/**
 * Reusable Action Button Component
 * 
 * @param {string} label - Text to show (or dynamic text like `Pay ₹${formattedAmount}`)
 * @param {boolean} loading - Displays loading state
 * @param {string} loadingText - Text to show during loading state
 * @param {function} onClick - Click handler (optional if type="submit")
 * @param {boolean} disabled - Disables the button
 * @param {string} type - Button type ("button" | "submit" | "reset")
 * @param {string} className - Extra custom tailwind classes if needed
 */
export default function ActionButton({
  label = "Continue",
  loading = false,
  loadingText = "Processing...",
  onClick,
  disabled = false,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`group flex w-full items-center justify-between rounded-[1px] bg-black px-5 py-2 text-xs font-bold tracking-widest uppercase text-white transition  disabled:opacity-50 active:scale-[0.99] shrink-0 cursor-pointer ${className}`}
    >
      <span>{loading ? loadingText : label}</span>

      {/* Circular White Badge with Lucide Icon */}
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
      </div>
    </button>
  );
}