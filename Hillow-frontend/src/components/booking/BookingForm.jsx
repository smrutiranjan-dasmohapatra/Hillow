import { useState, useEffect } from "react";
import { createBooking } from "../../services/bookingService";
import { useAuth } from "../../context/AuthContext";
import ActionButton from "../common/ActionButton"; // Adjust path if needed (e.g., "./ActionButton" or "../components/ActionButton")

export default function BookingForm({
  bookingData,
  setBookingData,
  setBooking,
  onNext,
  setStep,
}) {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Track image load state so we don't block UI paint
  const [imagesLoaded, setImagesLoaded] = useState({});

  const todayStr = new Date().toISOString().split("T")[0];

  const handleImageLoad = (capsuleName) => {
    setImagesLoaded((prev) => ({ ...prev, [capsuleName]: true }));
  };

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (
      bookingData.check_in &&
      bookingData.check_out &&
      bookingData.price_per_night
    ) {
      const start = new Date(bookingData.check_in);
      const end = new Date(bookingData.check_out);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setBookingData((prev) => ({
          ...prev,
          total_amount: diffDays * prev.price_per_night,
        }));
      }
    }
  }, [
    bookingData.check_in,
    bookingData.check_out,
    bookingData.price_per_night,
  ]);

  const selectVilla = (villa, price) => {
    setBookingData((prev) => ({
      ...prev,
      capsule_name: villa,
      price_per_night: price,
      total_amount: prev.total_amount || price,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookingData.check_in || !bookingData.check_out) {
      setError("Please select both Check-In and Check-Out dates.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await createBooking(bookingData, token);
      if (setBooking) setBooking(response.booking || bookingData);

      if (onNext) onNext();
      else if (setStep) setStep(2);
    } catch (err) {
      console.error(err);
      setError("Booking failed. Please check details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const capsules = [
    {
      name: "Classic C®",
      price: 10000,
      img: "/images/c1.jpg",
      available: true,
    },
    {
      name: "Terrace C®",
      price: 12000,
      img: "/images/c1.jpg",
      available: false,
    },
    {
      name: "Desert C®",
      price: 10000,
      img: "/images/c1.jpg",
      available: false,
    },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-full justify-between max-h-[calc(100vh-140px)]"
    >
      {/* Scrollable Form Body */}
      <div className="overflow-y-auto pr-1 space-y-5 pb-3 custom-scrollbar">
        {error && (
          <div className="rounded-lg bg-red-50 p-2 text-center text-xs font-medium text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {/* Step (1) Capsule Selection */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            (1) Which capsule would you like to reserve?
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {capsules.map((capsule) => {
              const isSelected = bookingData.capsule_name === capsule.name;
              const isLoaded = imagesLoaded[capsule.name];

              if (!capsule.available) {
                return (
                  <div
                    key={capsule.name}
                    className="relative flex flex-col justify-between rounded-xl bg-neutral-100 p-0.5 opacity-60 cursor-not-allowed border border-gray-200 overflow-hidden"
                  >
                    {/* Image Container with Soon Badge Overlay */}
                    <div className="relative h-14 w-full overflow-hidden rounded-lg bg-gray-200">
                      <span className="absolute top-1 right-1 z-20 rounded bg-amber-500/90 px-1 py-0.5 text-[7px] font-extrabold uppercase tracking-tight text-white backdrop-blur-[2px]">
                        Soon
                      </span>

                      {!isLoaded && (
                        <div className="absolute inset-0 bg-gray-300 animate-pulse z-10" />
                      )}
                      <img
                        src={capsule.img}
                        alt={capsule.name}
                        onLoad={() => handleImageLoad(capsule.name)}
                        className={`h-full w-full object-cover grayscale transition-opacity duration-300 ${
                          isLoaded ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </div>

                    <div className="py-1 text-center">
                      <h4 className="text-[10px] font-semibold text-gray-600 leading-none truncate">
                        {capsule.name}
                      </h4>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={capsule.name}
                  type="button"
                  onClick={() => selectVilla(capsule.name, capsule.price)}
                  className={`flex flex-col justify-between rounded-xl p-0.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-black text-white shadow-md ring-2 ring-black"
                      : "bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="relative h-14 w-full overflow-hidden rounded-lg bg-gray-200">
                    {!isLoaded && (
                      <div className="absolute inset-0 bg-gray-300 animate-pulse z-10" />
                    )}
                    <img
                      src={capsule.img}
                      alt={capsule.name}
                      onLoad={() => handleImageLoad(capsule.name)}
                      className={`h-full w-full object-cover transition-opacity duration-300 ${
                        isLoaded ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>

                  <div className="py-1 text-center w-full">
                    <h4 className="text-[10px] font-semibold tracking-tight leading-none truncate">
                      {capsule.name}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step (2) Dates & Guests */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            (2) Stay duration & guests
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Check-In
                </label>
                <input
                  type="date"
                  name="check_in"
                  min={todayStr}
                  required
                  value={bookingData.check_in || ""}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 bg-gray-50/50 p-1.5 text-xs text-gray-900 outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Check-Out
                </label>
                <input
                  type="date"
                  name="check_out"
                  min={bookingData.check_in || todayStr}
                  required
                  value={bookingData.check_out || ""}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 bg-gray-50/50 p-1.5 text-xs text-gray-900 outline-none focus:border-black focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Guests
                </label>
                <input
                  type="number"
                  name="guests"
                  min="1"
                  max="4"
                  value={bookingData.guests || 1}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 bg-gray-50/50 p-1.5 text-xs text-gray-900 outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Total (₹)
                </label>
                <input
                  type="text"
                  name="total_amount"
                  value={`₹ ${(
                    Number(bookingData.total_amount) || 0
                  ).toLocaleString("en-IN")}`}
                  readOnly
                  className="w-full border-b border-gray-200 bg-gray-100 p-1.5 text-xs font-bold text-gray-800 outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2 border-t border-gray-100 bg-white">
        <ActionButton
          type="submit"
          label="Continue"
          loading={loading}
          disabled={!bookingData.capsule_name || !bookingData.check_out}
        />
      </div>
    </form>
  );
}