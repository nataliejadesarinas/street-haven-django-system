from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('sale/', views.sale, name='sale'),
    path('shoes/', views.shoes, name='shoes'),
    path('apparel/', views.apparel, name='apparel'),
    path('toys/', views.toys, name='toys'),
    path('all/', views.all, name='all'),
    path('new/', views.new, name='new'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),  # add this
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('profile/', views.profile_view, name='profile'),
    path('user/', views.get_user_session, name='user_session'),
]
