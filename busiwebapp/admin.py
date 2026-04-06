from django.contrib import admin
from django.utils.html import format_html

# Register your models here.

from .models import Admin, Apparels, Brand, Category, Shoes, Toys
admin.site.register(Admin)

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Shoes)
class ShoesAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'category', 'brand', 'is_available', 'image_preview')
    list_filter = ('category', 'brand', 'is_available')
    search_fields = ('name', 'description')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'brand', 'category')
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'old_price', 'stock', 'is_available')
        }),
        ('Product Details', {
            'fields': ('color', 'gender')
        }),
        ('Product Images', {
            'fields': ('image_front', 'image_back', 'image_left', 'image_right'),
            'description': 'Upload images for different angles. Left image is used as primary display.'
        }),
    )
    
    def image_preview(self, obj):
        # Show left image as primary, fallback to front if left doesn't exist
        image_to_show = obj.image_left or obj.image_front
        if image_to_show:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />',
                image_to_show.url
            )
        return "No image"
    image_preview.short_description = 'Image Preview'

@admin.register(Apparels)
class ApparelsAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'category', 'brand', 'is_available')
    list_filter = ('category', 'brand', 'is_available')
    search_fields = ('name', 'description')

@admin.register(Toys)
class ToysAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'color', 'is_available')
    list_filter = ('color', 'is_available')
    search_fields = ('name', 'description')
