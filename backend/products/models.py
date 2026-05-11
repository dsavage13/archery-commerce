from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="products")
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
        
class HomepageBanner(models.Model):
    eyebrow = models.CharField(max_length=100, blank=True, default="Premium Gear")
    title = models.CharField(max_length=200, default="Precision Archery Equipment")
    subtitle = models.TextField(blank=True, default="Shop bows, arrows, and accessories.")
    button_text = models.CharField(max_length=50, blank=True, default="Shop Now")
    button_link = models.CharField(max_length=200, blank=True, default="/shop")
    image = models.ImageField(upload_to="banners/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Homepage Banner"
    
class TopAnnouncementBar(models.Model):
    message = models.CharField(max_length=255, default="Free shipping on orders over $99")
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Top Announcement Bar"