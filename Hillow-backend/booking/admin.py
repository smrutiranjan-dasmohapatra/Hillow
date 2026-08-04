from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "booking_id",
        "user",
        "capsule_name",
        "check_in",
        "check_out",
        "status",
    )

    search_fields = (
        "booking_id",
        "capsule_name",
    )

    list_filter = (
        "status",
        "check_in",
    )