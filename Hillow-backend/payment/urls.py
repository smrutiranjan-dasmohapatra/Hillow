from django.urls import path
from .views import FakePaymentView

urlpatterns = [
    path(
        "pay/",
        FakePaymentView.as_view(),
        name="fake-payment",
    ),
]