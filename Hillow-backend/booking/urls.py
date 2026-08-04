# urls.py
from django.urls import path
from .views import BookingCreateView, BookingDetailView, HealthCheckView

urlpatterns = [
    path('bookings/', BookingCreateView.as_view(), name='booking-list'),
    path('bookings/<int:pk>/', BookingDetailView.as_view(), name='booking-detail'), # 👈 CRITICAL FOR DELETES
    path('health/', HealthCheckView.as_view(), name='health-check'),
]