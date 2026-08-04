import { useLayoutEffect, useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { 
  X, 
  Calendar, 
  User, 
  CreditCard, 
  Sparkles, 
  Copy, 
  Check, 
  MapPin, 
  Download,
  RefreshCw 
} from "lucide-react";
import { getMyBookings } from "../../services/bookingService";
import { useAuth } from "../../context/AuthContext";

export default function MyBookingsDrawer({ isOpen, onClose }) {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  // Animation Refs
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const headerRef = useRef(null);
  const listRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // Fetch Bookings with token fallbacks
  const fetchBookings = useCallback(async () => {
    const activeToken = token || localStorage.getItem("token") || localStorage.getItem("jwt");

    if (!activeToken) {
      setError("Please sign in to view your reservations.");
      setBookings([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getMyBookings(activeToken);
      
      let items = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && Array.isArray(data.bookings)) {
        items = data.bookings;
      } else if (data && Array.isArray(data.data)) {
        items = data.data;
      }

      setBookings(items);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load your reservations.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isOpen) {
      fetchBookings();
    }
  }, [isOpen, user, token, fetchBookings]);

  // GSAP Entrance Animation
  useLayoutEffect(() => {
    if (!isOpen) return;

    const ctx = gsap.context(() => {
      isAnimatingRef.current = true;

      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(panelRef.current, { xPercent: 100, force3D: true });
      gsap.set([headerRef.current, listRef.current], { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });

      tl.to(backdropRef.current, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      })
        .to(
          panelRef.current,
          {
            xPercent: 0,
            duration: 0.35,
            ease: "power4.out",
          },
          "-=0.15"
        )
        .to(
          [headerRef.current, listRef.current],
          {
            opacity: 1,
            y: 0,
            duration: 0.25,
            stagger: 0.06,
            ease: "power2.out",
          },
          "-=0.18"
        );
    });

    return () => ctx.revert();
  }, [isOpen]);

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClose = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    gsap
      .timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
          onClose();
        },
      })
      .to([headerRef.current, listRef.current], {
        opacity: 0,
        y: 6,
        duration: 0.12,
        ease: "power2.in",
      })
      .to(
        panelRef.current,
        {
          xPercent: 100,
          duration: 0.28,
          ease: "power3.inOut",
        },
        "-=0.05"
      )
      .to(
        backdropRef.current,
        {
          opacity: 0,
          duration: 0.18,
          ease: "power2.in",
        },
        "-=0.2"
      );
  };

  if (!isOpen) return null;

  // Render via Portal to break out of parent container overflow
  return createPortal(
    <div className="fixed inset-0 z-[10000] flex justify-end overflow-hidden h-screen w-screen">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-black/65 cursor-pointer backdrop-blur-xs transition-opacity"
      />

      {/* Sliding Panel */}
      <div
        ref={panelRef}
        className="relative flex h-full w-full max-w-md flex-col justify-between overflow-y-auto bg-neutral-950 text-white shadow-2xl z-10 border-l border-white/10"
      >
        {/* Header Section */}
        <div ref={headerRef} className="p-6 pb-4 border-b border-white/10 relative">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-500 font-semibold">
                Member Passports
              </span>
              <h2 className="text-2xl font-light tracking-tight text-white mt-0.5">
                Your Reservations
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={fetchBookings}
                className="p-2 rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                title="Refresh Bookings"
              >
                <RefreshCw size={16} className={loading ? "animate-spin text-amber-400" : ""} />
              </button>
              <button
                onClick={handleClose}
                className="p-2 rounded-full text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                title="Close Drawer"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div ref={listRef} className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-neutral-900/50 p-5 space-y-3 animate-pulse"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-32 bg-white/10 rounded" />
                    <div className="h-5 w-16 bg-white/10 rounded-full" />
                  </div>
                  <div className="h-3 w-24 bg-white/10 rounded" />
                  <div className="h-3 w-40 bg-white/10 rounded" />
                  <div className="pt-3 border-t border-white/5 flex justify-between">
                    <div className="h-3 w-16 bg-white/10 rounded" />
                    <div className="h-3 w-20 bg-white/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-xs text-red-400">
              {error}
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-20 text-center text-white/40 space-y-3 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-1">
                <Sparkles size={20} className="text-amber-500/60" />
              </div>
              <p className="text-sm font-medium text-white/70">No Active Reservations</p>
              <p className="text-xs max-w-xs text-white/40">
                You haven't booked any Hillow Capsule House stays yet. Your journey begins whenever you are ready.
              </p>
            </div>
          ) : (
            bookings.map((item, index) => {
              const bookingId = item.booking_id || item._id || item.id || `HLW-${index + 101}`;
              
              return (
                <div
                  key={bookingId}
                  className="group relative rounded-xl border border-white/10 bg-neutral-900/80 p-5 backdrop-blur-md hover:border-amber-500/40 hover:bg-neutral-900 transition-all duration-300 shadow-lg"
                >
                  <div className="flex items-start justify-between border-b border-white/10 pb-3 mb-3">
                    <div>
                      <h3 className="font-medium text-sm text-white group-hover:text-amber-400 transition-colors">
                        {item.capsule_name || item.capsule?.name || "Aura Suite Capsule"}
                      </h3>
                      <p className="text-[10px] font-mono uppercase text-white/40 mt-0.5">
                        Hillow Sanctuary
                      </p>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full uppercase border ${
                        item.status === "PAID" || item.status === "CONFIRMED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {item.status || "CONFIRMED"}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs text-white/70">
                    <div className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-amber-400" />
                        <span className="font-mono text-[11px]">
                          {item.check_in || item.checkIn} → {item.check_out || item.checkOut}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-1.5 text-white/60">
                        <User size={13} className="text-amber-500/80" />
                        <span>{item.guests || 1} {item.guests === 1 ? "Guest" : "Guests"}</span>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-white font-semibold">
                        <CreditCard size={13} className="text-amber-500/80" />
                        <span>₹{(Number(item.total_amount || item.totalPrice) || 0).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40 font-mono">
                    <button
                      onClick={() => handleCopyId(bookingId)}
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                      title="Copy Reference ID"
                    >
                      <span>REF: {bookingId}</span>
                      {copiedId === bookingId ? (
                        <Check size={11} className="text-emerald-400" />
                      ) : (
                        <Copy size={11} />
                      )}
                    </button>

                    <div className="flex items-center gap-2 text-white/60">
                      <button
                        onClick={() => alert(`Showing details for Reference ID: ${bookingId}`)}
                        className="p-1 hover:text-amber-400 transition-colors"
                        title="Download Voucher"
                      >
                        <Download size={13} />
                      </button>
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 hover:text-amber-400 transition-colors"
                        title="Get Directions"
                      >
                        <MapPin size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-neutral-950">
          <button
            onClick={handleClose}
            className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-widest font-semibold transition-colors rounded-none"
          >
            Close Passport
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}