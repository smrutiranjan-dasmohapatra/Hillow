from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Booking  # 👈 Make sure to import your Booking model
from .serializers import BookingSerializer


class BookingCreateView(APIView):
    permission_classes = [IsAuthenticated]

    # 1. GET METHOD (Fetches all bookings belonging to the logged-in user)
    def get(self, request):
        bookings = Booking.objects.filter(user=request.user).order_by('-created_at')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 2. POST METHOD (Creates a new booking)
    def post(self, request):
        serializer = BookingSerializer(data=request.data)

        if serializer.is_valid():
            booking = serializer.save(user=request.user)

            return Response(
                {
                    "message": "Booking created successfully.",
                    "booking": BookingSerializer(booking).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class BookingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    # Helper method to retrieve booking safely
    def get_object(self, pk, user):
        try:
            # Ensures a user can only interact with their OWN booking
            return Booking.objects.get(pk=pk, user=user)
        except Booking.DoesNotExist:
            return None

    # 1. GET METHOD (Fetch single booking details)
    def get(self, request, pk):
        booking = self.get_object(pk, request.user)
        if not booking:
            return Response(
                {"error": "Booking not found or unauthorized."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 2. DELETE METHOD (Cancels/Deletes the booking permanently from DB)
    def delete(self, request, pk):
        booking = self.get_object(pk, request.user)
        if not booking:
            return Response(
                {"error": "Booking not found or unauthorized."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        booking.delete()
        return Response(
            {"message": "Booking deleted successfully."}, 
            status=status.HTTP_204_NO_CONTENT
        )


class HealthCheckView(APIView):
    def get(self, request):
        return Response({
            "status": "success",
            "message": "Hillow Backend is running 🚀"
        })