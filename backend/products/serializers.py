from rest_framework import serializers
from .models import Category, Product, HomepageBanner, TopAnnouncementBar


class CategorySerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )
    category_name = serializers.CharField(source="category.name", read_only=True)
    slug = serializers.CharField(required=False, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "price",
            "category",
            "category_id",
            "category_name",
            "image",
            "stock",
            "is_active",
            "created_at",
            "updated_at",
        ]
        
class HomepageBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomepageBanner
        fields = [
            "id",
            "eyebrow",
            "title",
            "subtitle",
            "button_text",
            "button_link",
            "image",
            "is_active",
            "updated_at",
        ]
        
class TopAnnouncementBarSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopAnnouncementBar
        fields = ["id", "message", "is_active", "updated_at"]