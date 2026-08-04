import api from "../api/axios";

export const fakePayment = async (bookingId, token) => {
    const response = await api.post(
        "/payment/pay/",
        {
            booking_id: bookingId,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};