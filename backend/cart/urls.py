from rest_framework.routers import DefaultRouter
from .views import CartViewSet
from django.urls import path, include

router = DefaultRouter()
router.register("items", CartViewSet, basename="cart-items")

urlpatterns = router.urls

