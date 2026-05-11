from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from products.views import HomepageBannerView, HomepageBannerAdminView, TopAnnouncementBarAdminView, TopAnnouncementBarView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/users/", include("users.urls")),
    path("api/", include("products.urls")),
    path("api/cart/", include("cart.urls")),
    path("api/orders/", include("orders.urls")),
    path("api/banner/", HomepageBannerView.as_view()),
    path("api/admin/banner/", HomepageBannerAdminView.as_view()),
    path("api/top-bar/", TopAnnouncementBarView.as_view()),
    path("api/admin/top-bar/", TopAnnouncementBarAdminView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)