from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('sale/', views.sale, name='sale'),
    path('shoes/', views.shoes, name='shoes'),
    path('apparel/', views.apparel, name='apparel'),
    path('toys/', views.toys, name='toys'),
    path('all/', views.all_products, name='all_products'),
    path('new/', views.new, name='new'),
    path('api/search/', views.search_api, name='search_api'),
    path('search/', views.search_results, name='search'),
    path('product/<str:product_type>/<int:pk>/', views.product_detail, name='product_detail'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('profile/', views.profile, name='profile'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin-dashboard/delete/<str:product_type>/<int:pk>/',
         views.delete_product, name='delete_product'),
]
