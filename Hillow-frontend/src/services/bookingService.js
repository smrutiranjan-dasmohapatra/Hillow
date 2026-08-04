import api from "../api/axios";

/* ===========================
   Create Booking
=========================== */
export const createBooking = async (bookingData, token) => {
  const response = await api.post(
    "/bookings/",
    bookingData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/* ===========================
   Get My Bookings
=========================== */
export const getMyBookings = async (token) => {
  const response = await api.get(
    "/bookings/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("========== BOOKINGS RESPONSE ==========");
  console.log(response.data);

  return response.data;
};

/* ===========================
   Delete Booking
=========================== */
export const deleteBooking = async (bookingId, token) => {
  const response = await api.delete(
    `/bookings/${bookingId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};