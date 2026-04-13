from django.contrib import admin
from django.urls import path
from busiwebapp import views   # adjust 'busiwebapp' to your actual app name

urlpatterns = [
    path('admin/', admin.site.urls),

    # ── Auth ──────────────────────────────────────────────────────────────────
    path('login/', views.login_view, name='login'),
    path('api/login/', views.login_api, name='login_api'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),

    # ── Pages ─────────────────────────────────────────────────────────────────
    path('',                    views.home,          name='home'),
    path('sale/',               views.sale,          name='sale'),
    path('all/',                views.all_products,  name='all_products'),
    path('apparel/',            views.apparel,       name='apparel'),
    path('shoes/',              views.shoes,         name='shoes'),
    path('toys/',               views.toys,          name='toys'),
    path('new/',                views.new,           name='new'),

    # ── Search ────────────────────────────────────────────────────────────────
    path('api/search/',         views.search_api,    name='search_api'),
    path('search/',             views.search,        name='search'),

    # ── Products ──────────────────────────────────────────────────────────────
    path('product/<str:product_type>/<int:pk>/',
         views.product_detail, name='product_detail'),

    # ── Admin dashboard (custom) ──────────────────────────────────────────────
    path('admin-dashboard/',    views.admin_dashboard, name='admin_dashboard'),
    path('admin-dashboard/delete/<str:product_type>/<int:pk>/',
         views.delete_product,  name='delete_product'),

    # ── Profile & account ─────────────────────────────────────────────────────
    path('profile/',            views.profile,        name='profile'),
    path('delete-account/',     views.delete_account, name='delete_account'),

    # ── APIs ──────────────────────────────────────────────────────────────────
    path('api/locations/',      views.location_api,  name='locations_api'),
    path('api/login/',          views.login_api,     name='login_api'),
]