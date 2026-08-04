import { useState } from "react";

import BookingForm from "../components/booking/BookingForm";
import BookingSummary from "../components/booking/BookingSummary";
import PaymentForm from "../components/booking/PaymentForm";
import BookingSuccess from "../components/booking/BookingSuccess";

export default function BookingPage() {
  const [step, setStep] = useState(1);

  const [booking, setBooking] = useState(null);

  return (
    <main className="min-h-screen bg-[#111] text-white flex items-center justify-center p-8">

      {step === 1 && (
        <BookingForm
          setStep={setStep}
          setBooking={setBooking}
        />
      )}

      {step === 2 && (
        <BookingSummary
          booking={booking}
          setStep={setStep}
        />
      )}

      {step === 3 && (
        <PaymentForm
          booking={booking}
          setBooking={setBooking}
          setStep={setStep}
        />
      )}

      {step === 4 && (
        <BookingSuccess
          booking={booking}
        />
      )}

    </main>
  );
}