from rest_framework import serializers


class FakePaymentSerializer(serializers.Serializer):
    booking_id = serializers.CharField(max_length=20)