from decimal import Decimal
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from cart.models import CartItem
from .models import Order, OrderItem
from .serializers import OrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.prefetch_related("items").all().order_by("-created_at")
        return Order.objects.prefetch_related("items").filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["post"])
    def checkout(self, request):
        cart_items = CartItem.objects.filter(user=request.user).select_related("product")

        if not cart_items.exists():
            return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        shipping_name = request.data.get("shipping_name", "").strip()
        shipping_address = request.data.get("shipping_address", "").strip()

        if not shipping_name or not shipping_address:
            return Response(
                {"detail": "Shipping name and shipping address are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order = Order.objects.create(
            user=request.user,
            shipping_name=shipping_name,
            shipping_address=shipping_address,
            status="pending",
        )

        total = Decimal("0.00")

        for item in cart_items:
            line_total = item.product.price * item.quantity
            total += line_total

            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                price=item.product.price,
                quantity=item.quantity,
            )

        order.total = total
        order.save()

        cart_items.delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)