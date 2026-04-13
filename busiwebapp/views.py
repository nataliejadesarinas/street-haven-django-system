from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.models import User
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import Brand, Category, Shoes, Apparels, Toys
from .forms import ShoesForm, ApparelsForm, ToysForm
import json
from datetime import date

# ─────────────────────────────────────────────
#  SHARED FILTER HELPER
# ─────────────────────────────────────────────
def _apply_filters(request, shoes_qs=None, apparel_qs=None, toys_qs=None):
    brand     = request.GET.get('brand',     '').strip()
    color     = request.GET.get('color',     '').strip()
    price_min = request.GET.get('price_min', '').strip()
    price_max = request.GET.get('price_max', '').strip()
    size      = request.GET.get('size',      '').strip()

    active_filters = {
        'brand': brand, 'color': color,
        'price_min': price_min, 'price_max': price_max, 'size': size,
    }

    if brand:
        if shoes_qs   is not None: shoes_qs   = shoes_qs.filter(brand__name__iexact=brand)
        if apparel_qs is not None: apparel_qs = apparel_qs.filter(brand__name__iexact=brand)
        if toys_qs    is not None: toys_qs    = Toys.objects.none()

    if color:
        if shoes_qs   is not None: shoes_qs   = shoes_qs.filter(color__icontains=color)
        if apparel_qs is not None: apparel_qs = apparel_qs.filter(color__icontains=color)
        if toys_qs    is not None: toys_qs    = toys_qs.filter(color__icontains=color)

    try:    pmin = float(price_min) if price_min else None
    except: pmin = None
    try:    pmax = float(price_max) if price_max else None
    except: pmax = None

    if pmin is not None:
        if shoes_qs   is not None: shoes_qs   = shoes_qs.filter(price__gte=pmin)
        if apparel_qs is not None: apparel_qs = apparel_qs.filter(price__gte=pmin)
        if toys_qs    is not None: toys_qs    = toys_qs.filter(price__gte=pmin)

    if pmax is not None:
        if shoes_qs   is not None: shoes_qs   = shoes_qs.filter(price__lte=pmax)
        if apparel_qs is not None: apparel_qs = apparel_qs.filter(price__lte=pmax)
        if toys_qs    is not None: toys_qs    = toys_qs.filter(price__lte=pmax)

    return shoes_qs, apparel_qs, toys_qs, active_filters


# ─────────────────────────────────────────────
#  PAGE VIEWS
# ─────────────────────────────────────────────
def home(request):
    featured_shoes = Shoes.objects.filter(is_available=True)[:8]
    return render(request, 'busiwebapp/home.html', {'featured_shoes': featured_shoes})


def sale(request):
    shoes   = Shoes.objects.filter(is_available=True)
    apparel = Apparels.objects.filter(is_available=True)
    toys    = Toys.objects.filter(is_available=True)
    shoes, apparel, toys, active_filters = _apply_filters(request, shoes, apparel, toys)
    return render(request, 'busiwebapp/sale.html', {
        'shoes': shoes, 'apparel': apparel, 'toys': toys,
        'active_filters': active_filters,
    })


def all_products(request):
    shoes   = Shoes.objects.filter(is_available=True)
    apparel = Apparels.objects.filter(is_available=True)
    toys    = Toys.objects.filter(is_available=True)
    shoes, apparel, toys, active_filters = _apply_filters(request, shoes, apparel, toys)
    return render(request, 'busiwebapp/all_products.html', {
        'shoes': shoes, 'apparel': apparel, 'toys': toys,
        'active_filters': active_filters,
    })


def apparel(request):
    apparel = Apparels.objects.filter(is_available=True)
    _, apparel, _, active_filters = _apply_filters(request, apparel_qs=apparel)
    return render(request, 'busiwebapp/apparel.html', {
        'apparel': apparel, 'active_filters': active_filters,
    })


def shoes(request):
    shoes = Shoes.objects.filter(is_available=True)
    shoes, _, _, active_filters = _apply_filters(request, shoes_qs=shoes)
    return render(request, 'busiwebapp/shoes.html', {
        'shoes': shoes, 'active_filters': active_filters,
    })


def toys(request):
    toys = Toys.objects.filter(is_available=True)
    _, _, toys, active_filters = _apply_filters(request, toys_qs=toys)
    return render(request, 'busiwebapp/toys.html', {
        'toys': toys, 'active_filters': active_filters,
    })


def new(request):
    latest_shoes = Shoes.objects.filter(is_available=True).order_by('-id')[:8]
    return render(request, 'busiwebapp/new.html', {'latest_shoes': latest_shoes})


def search_api(request):
    q = request.GET.get('q', '').strip()
    results = []
    if q:
        from .search_utils import combined_search_querysets
        shoes_qs, apparel_qs, toys_qs = combined_search_querysets(q)
        for item in shoes_qs[:5]:
            results.append({'name': item.name, 'brand': item.brand.name if item.brand else '',
                'category': 'Shoes', 'price': float(item.price), 'description': item.description,
                'image': item.image.url if item.image else ''})
        for item in apparel_qs[:5]:
            results.append({'name': item.name, 'brand': item.brand.name if item.brand else '',
                'category': 'Apparel', 'price': float(item.price), 'description': item.description,
                'image': item.image.url if item.image else ''})
        for item in toys_qs[:5]:
            results.append({'name': item.name, 'brand': '', 'category': 'Toys',
                'price': float(item.price), 'description': item.description,
                'image': item.image.url if item.image else ''})
    return JsonResponse({'query': q, 'results': results})


def search(request):
    q = request.GET.get('q', '').strip().lower()
    combined = []
    if not q:
        return render(request, 'busiwebapp/search.html', {'total': 0, 'query': ''})
    from .search_utils import combined_search_querysets
    shoes_qs, apparel_qs, toys_qs = combined_search_querysets(q)
    for item in shoes_qs:   combined.append(('shoes', item))
    for item in apparel_qs: combined.append(('apparels', item))
    for item in toys_qs:    combined.append(('toys', item))
    return render(request, 'busiwebapp/search.html', {
        'query': q, 'combined': combined, 'total': len(combined),
    })


def product_detail(request, product_type, pk):
    if product_type == 'shoes':
        product = get_object_or_404(Shoes, pk=pk)
        brand_name = product.brand.name if product.brand else 'Unknown'
    elif product_type == 'apparels':
        product = get_object_or_404(Apparels, pk=pk)
        brand_name = product.brand.name if product.brand else 'Unknown'
    elif product_type == 'toys':
        product = get_object_or_404(Toys, pk=pk)
        brand_name = 'Collectible'
    else:
        return redirect('home')
    return render(request, 'busiwebapp/product_detail.html', {
        'product': product, 'product_type': product_type, 'brand_name': brand_name,
    })


# ─────────────────────────────────────────────
#  PROFILE
# ─────────────────────────────────────────────
@login_required
def profile(request):
    if request.method == 'POST':
        action = request.POST.get('action')

        if action == 'update_profile':
            request.user.first_name = request.POST.get('first_name', '')
            request.user.last_name  = request.POST.get('last_name', '')
            request.user.email      = request.POST.get('email', '')
            request.user.save()
            messages.success(request, 'Profile updated successfully.')

        elif action == 'change_username':
            new_username = request.POST.get('username', '').strip()
            if not new_username:
                messages.error(request, 'Username cannot be empty.')
            elif User.objects.filter(username=new_username).exclude(pk=request.user.pk).exists():
                messages.error(request, 'That username is already taken.')
            else:
                request.user.username = new_username
                request.user.save()
                messages.success(request, 'Username updated successfully.')

        elif action == 'change_password':
            current = request.POST.get('current_password', '')
            new_pw  = request.POST.get('new_password', '')
            confirm = request.POST.get('confirm_password', '')
            if not request.user.check_password(current):
                messages.error(request, 'Current password is incorrect.')
            elif new_pw != confirm:
                messages.error(request, 'New passwords do not match.')
            elif len(new_pw) < 6:
                messages.error(request, 'Password must be at least 6 characters.')
            else:
                request.user.set_password(new_pw)
                request.user.save()
                update_session_auth_hash(request, request.user)
                messages.success(request, 'Password changed successfully.')

        return redirect('profile')

    return render(request, 'busiwebapp/profile.html', {'user': request.user})


def delete_account(request):
    if request.method == 'POST' and request.user.is_authenticated:
        request.user.delete()
        logout(request)
        return redirect('home')
    return redirect('profile')


# ─────────────────────────────────────────────
#  AUTH  —  LOGIN / LOGOUT / REGISTER
# ─────────────────────────────────────────────

def login_view(request):
    """
    Form-based login submitted from the modal.
    Superuser / staff  →  /admin-dashboard/
    Regular user       →  /profile/
    """
    # Already logged in
    if request.user.is_authenticated:
        if request.user.is_superuser or request.user.is_staff:
            return redirect('admin_dashboard')
        return redirect('profile')

    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')

        if not username or not password:
            messages.error(request, 'Please enter both username and password.')
            return redirect('home')

        user = authenticate(request, username=username, password=password)

        if user is None:
            messages.error(request, 'Invalid username or password.')
            return redirect('home')

        if not user.is_active:
            messages.error(request, 'This account has been deactivated.')
            return redirect('home')

        login(request, user)

        # ── Role-based redirect ──────────────────
        if user.is_superuser or user.is_staff:
            return redirect('admin_dashboard')
        return redirect('profile')

    # GET — just send back to home where the modal lives
    return redirect('home')


def logout_view(request):
    """Log the user out and return to the home page."""
    logout(request)
    return redirect('home')


def register_view(request):
    """
    Creates a new regular user from the sign-up modal.
    On success → auto-login + redirect to profile.
    On failure → back to home with an error message.
    """
    if request.method != 'POST':
        return redirect('home')

    username = request.POST.get('username', '').strip()
    password = request.POST.get('password', '')
    email    = request.POST.get('email', '').strip()
    name     = request.POST.get('name', '').strip()

    # Validation
    if not username or not password:
        messages.error(request, 'Username and password are required.')
        return redirect('home')

    if len(password) < 6:
        messages.error(request, 'Password must be at least 6 characters.')
        return redirect('home')

    if User.objects.filter(username=username).exists():
        messages.error(request, f'Username "{username}" is already taken. Please choose another.')
        return redirect('home')

    if email and User.objects.filter(email=email).exists():
        messages.error(request, 'An account with that email already exists.')
        return redirect('home')

    # Split full name into first / last
    parts = name.split(' ', 1) if name else ['', '']
    first_name = parts[0]
    last_name  = parts[1] if len(parts) > 1 else ''

    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
        first_name=first_name,
        last_name=last_name,
    )

    login(request, user)
    messages.success(request, f'Welcome to Street.Haven, {username}! 🎉')
    return redirect('profile')


# ─────────────────────────────────────────────
#  LOGIN API  (AJAX — kept for JS compatibility)
# ─────────────────────────────────────────────
@csrf_exempt
@require_POST
def login_api(request):
    """AJAX login used by the JS doLogin() function."""
    try:
        data     = json.loads(request.body)
        email    = data.get('email', '').strip()
        password = data.get('password', '')

        if not email or not password:
            return JsonResponse({'success': False, 'error': 'Email and password are required'})

        import re
        if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
            return JsonResponse({'success': False, 'error': 'Please enter a valid email address'})

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Account not found. Do you want to create an account?'})

        if not user.is_active:
            return JsonResponse({'success': False, 'error': 'Your account is not active.'})

        authenticated_user = authenticate(request, username=user.username, password=password)

        if authenticated_user is not None:
            login(request, authenticated_user)
            redirect_url = (
                '/admin-dashboard/'
                if authenticated_user.is_superuser or authenticated_user.is_staff
                else '/profile/'
            )
            return JsonResponse({
                'success': True,
                'redirect': redirect_url,
                'user': {
                    'id': authenticated_user.id,
                    'username': authenticated_user.username,
                    'email': authenticated_user.email,
                    'is_superuser': authenticated_user.is_superuser,
                    'is_staff': authenticated_user.is_staff,
                    'first_name': authenticated_user.first_name,
                    'last_name': authenticated_user.last_name,
                }
            })
        else:
            return JsonResponse({'success': False, 'error': 'Wrong email or password. Please try again.'})

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Invalid request format'})
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f'Login API error: {e}')
        return JsonResponse({'success': False, 'error': 'Login failed. Please try again.'})


# ─────────────────────────────────────────────
#  ADMIN DASHBOARD
# ─────────────────────────────────────────────
@staff_member_required
def admin_dashboard(request):
    shoes_form    = ShoesForm()
    apparels_form = ApparelsForm()
    toys_form     = ToysForm()

    if request.method == 'POST':
        product_type = request.POST.get('product_type')
        if product_type == 'shoes':
            shoes_form = ShoesForm(request.POST, request.FILES)
            if shoes_form.is_valid():
                shoes_form.save()
                return redirect('admin_dashboard')
        elif product_type == 'apparels':
            apparels_form = ApparelsForm(request.POST, request.FILES)
            if apparels_form.is_valid():
                apparels_form.save()
                return redirect('admin_dashboard')
        elif product_type == 'toys':
            toys_form = ToysForm(request.POST, request.FILES)
            if toys_form.is_valid():
                toys_form.save()
                return redirect('admin_dashboard')

    context = {
        'shoes_form':    shoes_form,
        'apparels_form': apparels_form,
        'toys_form':     toys_form,
        'shoes':         Shoes.objects.all().order_by('-id'),
        'apparels':      Apparels.objects.all().order_by('-id'),
        'toys':          Toys.objects.all().order_by('-id'),
        'shoes_count':   Shoes.objects.count(),
        'apparel_count': Apparels.objects.count(),
        'toys_count':    Toys.objects.count(),
        'admin_user':    request.user,
    }
    return render(request, 'busiwebapp/admin_dashboard.html', context)


@staff_member_required
def delete_product(request, product_type, pk):
    if request.method == 'POST':
        if product_type == 'shoes':      Shoes.objects.filter(pk=pk).delete()
        elif product_type == 'apparels': Apparels.objects.filter(pk=pk).delete()
        elif product_type == 'toys':     Toys.objects.filter(pk=pk).delete()
    return redirect('admin_dashboard')


def location_api(request):
    data = {
        'Metro Manila': ['Manila','Quezon City','Makati','Pasig','Taguig','Mandaluyong','Marikina','Parañaque'],
        'Bulacan':      ['Malolos','San Jose del Monte','Meycauayan','Santa Maria','Caloocan'],
        'Rizal':        ['Antipolo','Taytay','Cainta','Rodriguez','San Mateo'],
        'Cavite':       ['Dasmariñas','Bacoor','Imus','Trece Martires','Tagaytay'],
        'Laguna':       ['Santa Cruz','Calamba','San Pablo','Biñan','Sta. Rosa'],
        'Batangas':     ['Batangas City','Lipa City','Tanauan','Balayan','Nasugbu'],
        'Pampanga':     ['San Fernando','Angeles City','Mabalacat','Porac','Lubao'],
        'Bataan':       ['Balanga','Dinalupihan','Mariveles','Orani'],
        'Zambales':     ['Olongapo City','Iba','Botolan','Candelaria'],
        'Nueva Ecija':  ['Cabanatuan City','Palayan City','Gapan City','Muñoz'],
    }
    return JsonResponse(data)