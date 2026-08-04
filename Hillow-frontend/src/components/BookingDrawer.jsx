import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowLeft, X } from "lucide-react";

import BookingForm from "./booking/BookingForm";
import BookingSummary from "./booking/BookingSummary";
import PaymentForm from "./booking/PaymentForm";
import BookingSuccess from "./booking/BookingSuccess";

export default function BookingDrawer({ isOpen, onClose }) {
  const [step, setStep] = useState(1);

  const [bookingData, setBookingData] = useState({
    capsule_name: "",
    check_in: "",
    check_out: "",
    guests: 1,
    total_amount: 0,
  });

  const [booking, setBooking] = useState(null);

  // Animation Refs
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // GSAP Fast Controlled Entry Animation Setup
  useLayoutEffect(() => {
    if (!isOpen) return;

    const ctx = gsap.context(() => {
      isAnimatingRef.current = true;

      // Initial state setups
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(panelRef.current, { xPercent: 100, force3D: true });
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
  }, [isOpen]);

  // Fast animation when changing steps inside drawer
  useLayoutEffect(() => {
    if (!isOpen || isAnimatingRef.current) return;

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
  }, [step, isOpen]);

  if (!isOpen) return null;

  // Fast controlled exit sequence on close
  const handleClose = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    gsap
      .timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
          setStep(1);
          onClose();
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
          xPercent: 100,
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

  // Back step navigation
  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  // Dynamic titles & subtitles tailored for each step in editorial style
  const getHeaderContent = () => {
    switch (step) {
      case 1:
        return {
          title: "Make it memorable and reserve one of our—Capsules®",
          subtitle:
            "Ready to start your journey to a Hillow Capsule House adventure? Secure your capsule by filling out the reservation form. We hope to see you soon!",
        };
      case 2:
        return {
          title: "Review your stay details and confirm—Reservation®",
          subtitle:
            "Please double-check your check-in dates, capsule selection, and total pricing before moving forward to payment.",
        };
      case 3:
        return {
          title: "Complete payment to lock in your—Experience®",
          subtitle:
            "Enter your payment information securely to finalize your booking with Hillow Capsule House.",
        };
      case 4:
        return {
          title: "You're all set for your upcoming—Stay®",
          subtitle:
            "Your reservation has been successfully confirmed! A receipt and full trip details have been sent to your email.",
        };
      default:
        return { title: "", subtitle: "" };
    }
  };

  const { title, subtitle } = getHeaderContent();

  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      {/* Backdrop (No blur filter) */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 cursor-pointer transition-opacity"
      />

      {/* Sliding Drawer Container */}
      <div
        ref={panelRef}
        className="relative flex h-full w-full max-w-lg flex-col justify-between overflow-y-auto bg-white text-black shadow-2xl z-10"
      >
        {/* Header Section */}
        <div className="relative p-6 pb-2">
          {/* Top Controls: Back & Close Buttons */}
          <div className="absolute right-6 top-6 flex items-center gap-2 z-20">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex h-9 items-center gap-1.5 rounded-full bg-gray-100 px-3.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200 hover:text-black"
                title="Go Back"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            )}
            <button
              onClick={handleClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 hover:text-black"
              title="Close Drawer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Dynamic Bold Editorial Header */}
          <div ref={headerRef} className="pr-28 space-y-2">
            <h2 className="text-2xl font-medium leading-tight tracking-tight text-gray-900 sm:text-3xl">
              {title}
            </h2>
            <p className="text-xs leading-relaxed text-gray-500">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Step Body */}
        <div ref={bodyRef} className="flex-1 px-6 pb-6">
          {step === 1 && (
            <BookingForm
              bookingData={bookingData}
              setBookingData={setBookingData}
              setBooking={setBooking}
              setStep={setStep}
            />
          )}

          {step === 2 && (
            <BookingSummary booking={booking} setStep={setStep} />
          )}

          {step === 3 && (
            <PaymentForm
              booking={booking}
              setBooking={setBooking}
              setStep={setStep}
            />
          )}

          {step === 4 && (
            <BookingSuccess booking={booking} onClose={handleClose} />
          )}
        </div>
      </div>
    </div>
  );
}