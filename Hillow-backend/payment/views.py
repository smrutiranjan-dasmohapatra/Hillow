from django.shortcuts import render

# Create your views here.
from booking.serializers import BookingSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from booking.models import Booking
from .serializers import FakePaymentSerializer


class FakePaymentView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = FakePaymentSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        booking_id = serializer.validated_data["booking_id"]

        try:
            booking = Booking.objects.get(
                booking_id=booking_id,
                user=request.user
            )
        except Booking.DoesNotExist:
            return Response(
                {
                    "message": "Booking not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if booking.status == "PAID":
            return Response(
                {
                    "message": "Booking is already paid."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = "PAID"
        booking.save()

        return Response(
    {
        "message": "Payment successful.",
        "booking": BookingSerializer(booking).data,
    },
    status=status.HTTP_200_OK,
)