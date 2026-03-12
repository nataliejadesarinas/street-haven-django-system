from django.contrib import admin

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
    list_display = ('name', 'price', 'stock', 'category', 'brand', 'is_available')
    list_filter = ('category', 'brand', 'is_available')
    search_fields = ('name', 'description')

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
