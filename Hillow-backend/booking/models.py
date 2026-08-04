from django.db import models
from django.contrib.auth.models import User

class Booking(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("CANCELLED", "Cancelled"),
    ]

    booking_id = models.CharField(
        max_length=20,
        unique=True,
        editable=False
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="bookings"
    )
    capsule_name = models.CharField(max_length=100)
    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.PositiveIntegerField()
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.booking_id if self.booking_id else f"Unsaved Booking ({self.capsule_name})"
    
    def save(self, *args, **kwargs):
        # Only generate a booking_id if it doesn't exist yet
        if not self.booking_id:
            last_booking = Booking.objects.order_by("-id").first()
            
            if last_booking and last_booking.booking_id:
                try:
                    # Safely split and convert to integer
                    last_id = int(last_booking.booking_id.split("-")[1])
                    next_id = last_id + 1
                except (IndexError, ValueError):
                    # Fallback if the last ID format was corrupted/unexpected
                    next_id = last_booking.id + 1 if last_booking.id else 1
            else:
                next_id = 1

            self.booking_id = f"CV-{next_id:06d}"

        super().save(*args, **kwargs)