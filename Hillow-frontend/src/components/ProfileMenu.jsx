import { useLayoutEffect, useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { User, BookOpen, LogOut, X, ChevronRight } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getMyBookings, deleteBooking } from "../services/bookingService";

import BookingsView from "../components/booking/mybooking/BookingsView";
import ProfileDetailsView from "../components/booking/mybooking/ProfileDetailsView";
import ConfirmModal from "../components/booking/mybooking/ConfirmModal";

export default function ProfileMenu() {
  const { user, token, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [activeView, setActiveView] = useState("menu");
  const [isExpanded, setIsExpanded] = useState(false);

  // Bookings Data States
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  // Modal State
  const [confirmModal, setConfirmModal] = useState({ show: false, type: "single", bookingId: null });

  // Animation Refs (Mirrored structure from BookingDrawer)
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // Fetch Bookings
  const fetchBookings = useCallback(async () => {
    const activeToken = token || localStorage.getItem("token") || localStorage.getItem("jwt");

    if (!activeToken) {
      setBookingsError("Please sign in to view reservations.");
      setBookings([]);
      return;
    }

    setLoadingBookings(true);
    setBookingsError("");

    try {
      const data = await getMyBookings(activeToken);
      let items = Array.isArray(data)
        ? data
        : data?.bookings || data?.results || data?.data || [];
      setBookings(items);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookingsError("Failed to load your reservations.");
    } finally {
      setLoadingBookings(false);
    }
  }, [token]);

  // Execute Deletion
  const executeDeleteBooking = async () => {
    const activeToken = token || localStorage.getItem("token") || localStorage.getItem("jwt");
    if (!activeToken) return;

    if (confirmModal.type === "all") {
      setIsDeletingAll(true);
      setConfirmModal({ show: false, type: "single", bookingId: null });

      try {
        const deletePromises = bookings.map((b) => deleteBooking(b.id || b.booking_id || b._id, activeToken));
        await Promise.all(deletePromises);
        setBookings([]);
      } catch (err) {
        console.error("Failed to delete all bookings:", err);
        setBookingsError("Failed to delete all bookings. Please try again.");
      } finally {
        setIsDeletingAll(false);
      }
    } else {
      const bookingId = confirmModal.bookingId;
      if (!bookingId) return;

      setDeletingId(bookingId);
      setConfirmModal({ show: false, type: "single", bookingId: null });

      try {
        await deleteBooking(bookingId, activeToken);
        setBookings((prev) => prev.filter((b) => (b.id || b.booking_id || b._id) !== bookingId));
      } catch (err) {
        console.error("Failed to delete booking:", err);
        setBookingsError("Failed to delete booking. Please try again.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  useEffect(() => {
    if (activeView === "bookings") fetchBookings();
  }, [activeView, fetchBookings]);

  // GSAP Fast Controlled Entry Animation Setup (From Left: xPercent: -100)
  useLayoutEffect(() => {
    if (!open) return;

    const ctx = gsap.context(() => {
      isAnimatingRef.current = true;

      // Initial state setups
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(panelRef.current, { xPercent: -100, force3D: true });
      gsap.set([headerRef.current, bodyRef.current], { opacity: 0, y: 10 });

      // Fast, snappy timeline sequence
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
            duration: 0.32,
            ease: "power4.out",
          },
          "-=0.15"
        )
        .to(
          [headerRef.current, bodyRef.current],
          {
            opacity: 1,
            y: 0,
            duration: 0.25,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.18"
        );
    });

    return () => ctx.revert();
  }, [open]);

  // Fast animation when changing views/tabs inside drawer
  useLayoutEffect(() => {
    if (!open || isAnimatingRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bodyRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }
      );
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -4 },
        { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" }
      );
    });

    return () => ctx.revert();
  }, [activeView, open]);

  // Fast controlled exit sequence on close (Slide back to Left: xPercent: -100)
  const handleClose = (callback) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    gsap
      .timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
          setOpen(false);
          setActiveView("menu");
          setIsExpanded(false);
          if (callback && typeof callback === "function") callback();
        },
      })
      .to([headerRef.current, bodyRef.current], {
        opacity: 0,
        y: 6,
        duration: 0.12,
        ease: "power2.in",
      })
      .to(
        panelRef.current,
        {
          xPercent: -100,
          duration: 0.25,
          ease: "power3.inOut",
        },
        "-=0.05"
      )
      .to(
        backdropRef.current,
        {
          opacity: 0,
          duration: 0.15,
          ease: "power2.in",
        },
        "-=0.18"
      );
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!user) return null;

  const initials = user.first_name && user.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : (user.username?.[0] || user.email?.[0] || "U").toUpperCase();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center   text-white text-sm font-medium transition cursor-pointer rounded-none"
      >
        <span>Booking</span>
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex justify-start overflow-hidden">
            {/* Backdrop */}
            <div
              ref={backdropRef}
              onClick={() => handleClose()}
              className="fixed inset-0 bg-black/60 cursor-pointer transition-opacity"
            />

            {/* Sliding Drawer Container (From Left) */}
            <div
              ref={panelRef}
              className={`relative flex h-full w-full flex-col justify-between overflow-y-auto bg-white text-black shadow-2xl z-10 transition-[max-width] duration-300 ${
                isExpanded ? "max-w-full" : "max-w-sm"
              }`}
            >
              {/* Header Section */}
              <div ref={headerRef} className="relative p-6 pb-2">
                <div className="absolute right-6 top-6 flex items-center gap-2 z-20">
                  <button
                    onClick={() => handleClose()}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 hover:text-black cursor-pointer"
                    title="Close Drawer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="pr-12 space-y-1">
                  <h2 className="text-xl font-medium leading-tight tracking-tight text-gray-900 sm:text-2xl">
                    Manage your account and reservations—Profile®
                  </h2>
                  <p className="text-xs leading-relaxed text-gray-500">
                    View active bookings or update your personal parameters.
                  </p>
                </div>
              </div>

              {/* Body Content Section */}
              <div ref={bodyRef} className="flex-1 px-6 pb-6 flex flex-col min-h-0">
                {activeView === "menu" && (
                  <div className="flex flex-col h-full justify-between overflow-hidden">
                    <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pt-2">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white font-semibold text-sm shrink-0">
                          {initials}
                        </div>
                        <div className="truncate">
                          <h3 className="font-semibold text-sm leading-tight text-black truncate">
                            {user.first_name ? `${user.first_name} ${user.last_name || ""}` : user.username || "User"}
                          </h3>
                          <p className="text-xs text-neutral-500 truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <button
                          onClick={() => setActiveView("bookings")}
                          className="flex w-full items-center justify-between p-3.5 text-sm transition bg-gray-50 hover:bg-gray-100 border border-gray-200 group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <BookOpen size={16} className="text-black" />
                            <span className="font-medium text-black">My Bookings</span>
                          </div>
                          <ChevronRight size={16} className="text-neutral-400 group-hover:text-black transition" />
                        </button>

                        <button
                          onClick={() => setActiveView("details")}
                          className="flex w-full items-center justify-between p-3.5 text-sm transition bg-gray-50 hover:bg-gray-100 border border-gray-200 group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <User size={16} className="text-neutral-700" />
                            <span className="font-medium text-black">Profile Details</span>
                          </div>
                          <ChevronRight size={16} className="text-neutral-400 group-hover:text-black transition" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 shrink-0">
                      <button
                        onClick={() => handleClose(() => logout())}
                        className="flex w-full items-center justify-center gap-2 p-3 text-sm bg-red-600 text-white transition hover:bg-red-700 font-medium cursor-pointer"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeView === "bookings" && (
                  <BookingsView
                    bookings={bookings}
                    loading={loadingBookings}
                    error={bookingsError}
                    isExpanded={isExpanded}
                    isDeletingAll={isDeletingAll}
                    deletingId={deletingId}
                    copiedId={copiedId}
                    onBack={() => setActiveView("menu")}
                    onClose={() => handleClose()}
                    onRefresh={fetchBookings}
                    onToggleExpand={() => setIsExpanded(!isExpanded)}
                    onDeleteAllRequest={() => setConfirmModal({ show: true, type: "all", bookingId: null })}
                    onDeleteSingleRequest={(id) => setConfirmModal({ show: true, type: "single", bookingId: id })}
                    onCopyId={handleCopyId}
                  />
                )}

                {activeView === "details" && (
                  <ProfileDetailsView
                    user={user}
                    onBack={() => setActiveView("menu")}
                    onClose={() => handleClose()}
                  />
                )}
              </div>
            </div>

            {/* CONFIRMATION MODAL */}
            <ConfirmModal
              confirmState={confirmModal}
              onClose={() => setConfirmModal({ show: false, type: "single", bookingId: null })}
              onConfirm={executeDeleteBooking}
            />
          </div>,
          document.body
        )}
    </>
  );
}