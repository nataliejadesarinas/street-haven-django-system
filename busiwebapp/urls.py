from django.contrib import admin
from django.urls import include, path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('home/', views.home, name='home'),
    path('sale/', views.sale, name='sale'),
    path('all/', views.all, name='all'),
    path('apparel/', views.apparel, name='apparel'),
    path('shoes/', views.shoes, name='shoes'),
    path('toys/', views.toys, name='toys'),
    path('new/', views.new, name='new'),
]