from rest_framework import viewsets, permissions, filters
from .models import Product, Category, HomepageBanner, TopAnnouncementBar
from .serializers import ProductSerializer, CategorySerializer, HomepageBannerSerializer, TopAnnouncementBarSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAdminUser


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("category").all().order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description", "category__name"]
    ordering_fields = ["price", "created_at", "name"]
    parser_classes = [MultiPartParser, FormParser]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class HomepageBannerView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        banner = HomepageBanner.objects.filter(is_active=True).order_by("-updated_at").first()
        if not banner:
            return Response({})
        return Response(HomepageBannerSerializer(banner).data)

class HomepageBannerAdminView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        banner = HomepageBanner.objects.order_by("-updated_at").first()
        if not banner:
            banner = HomepageBanner.objects.create()
        return Response(HomepageBannerSerializer(banner).data)

    def put(self, request):
        banner = HomepageBanner.objects.order_by("-updated_at").first()
        if not banner:
            banner = HomepageBanner.objects.create()

        serializer = HomepageBannerSerializer(banner, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class TopAnnouncementBarView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        bar = TopAnnouncementBar.objects.filter(is_active=True).order_by("-updated_at").first()
        if not bar:
            return Response({})
        return Response(TopAnnouncementBarSerializer(bar).data)


class TopAnnouncementBarAdminView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        bar = TopAnnouncementBar.objects.order_by("-updated_at").first()
        if not bar:
            bar = TopAnnouncementBar.objects.create()
        return Response(TopAnnouncementBarSerializer(bar).data)

    def put(self, request):
        bar = TopAnnouncementBar.objects.order_by("-updated_at").first()
        if not bar:
            bar = TopAnnouncementBar.objects.create()

        serializer = TopAnnouncementBarSerializer(bar, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)