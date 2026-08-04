from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking
        fields = "__all__"

        read_only_fields = (
            "booking_id",
            "status",
            "created_at",
            "user",
        )

    def validate(self, attrs):
        if attrs["check_out"] <= attrs["check_in"]:
            raise serializers.ValidationError(
                "Check-out date must be after check-in date."
            )

        if attrs["guests"] < 1:
            raise serializers.ValidationError(
                "Guests must be at least 1."
            )

        return attrs